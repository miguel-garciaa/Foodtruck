#!/usr/bin/env python3
"""Fixed DEV operations. Installed root-owned; no remote shell or downloaded host scripts."""
import argparse
import contextlib
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from zoneinfo import ZoneInfo

CONFIG_FILES = ('compose.yaml', 'compose.tunnel.yaml', 'compose.release.yaml', 'infrastructure/Caddyfile', 'infrastructure/db-init.sh')
CHECKS = ('Detección de secretos', 'Cuentas, permisos y servidor', 'Comprobaciones de la app',
          'Seguridad de dependencias de la app', 'Seguridad del código y de Actions', 'APK y recorridos Android',
          'Pruebas obligatorias', 'Construir y verificar la release')
FAMILIES = {
    'services': ('Servicios internos', 'La API, DB, Redis o los procesos de trabajo no están disponibles.', 'Revisar servicios, dependencias y registros locales.'),
    'queues': ('Colas', 'Hay trabajo pendiente demasiado antiguo o fallido.', 'Revisar Horizon y la entrega de outbox, sin reenviar efectos a ciegas.'),
    'disk': ('Espacio en disco', 'Puede impedir escritura, despliegue o backup.', 'Liberar espacio revisado; conservar volúmenes y última copia válida.'),
    'backup': ('Backup', 'No existe una copia reciente comprobada.', 'Revisar Restic, espacio y temporizadores; no promover releases.'),
    'restore': ('Restauración de prueba', 'La recuperación no se ha podido demostrar.', 'Revisar la copia y el entorno desechable; no usar la base DEV para probar.'),
    'deployment': ('Despliegue DEV', 'Una release no pudo aplicarse o comprobarse.', 'Revisar GitHub y el estado local; preservar datos y release anterior.'),
}


class OperationError(RuntimeError):
    pass


class OperationBusy(OperationError):
    pass


def atomic(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    temporary = path.with_suffix('.new')
    with temporary.open('w', encoding='utf-8') as output:
        os.chmod(temporary, 0o600)
        json.dump(value, output, sort_keys=True)
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


def load(path, default=None):
    try:
        return json.loads(Path(path).read_text())
    except FileNotFoundError:
        return default


def config_hash(root):
    digest = hashlib.sha256()
    for name in CONFIG_FILES:
        digest.update(name.encode() + b'\0' + (Path(root) / name).read_bytes())
    return digest.hexdigest()


def migration_hash(root):
    digest = hashlib.sha256()
    for path in sorted((Path(root) / 'backend/database/migrations').glob('*.php')):
        digest.update(path.name.encode() + b'\0' + path.read_bytes())
    return digest.hexdigest()


def validate_release(manifest, deployment, run, jobs, main_sha, expected_config):
    sha = manifest.get('sha', '')
    if manifest.get('version') != 1 or not re.fullmatch(r'[0-9a-f]{40}', sha):
        raise OperationError('Manifiesto inválido')
    if sha != deployment.get('sha') or sha != run.get('head_sha') or sha != main_sha:
        raise OperationError('Release ajena al SHA actual de main')
    if deployment.get('environment') != 'dev' or deployment.get('creator', {}).get('login') != 'github-actions[bot]':
        raise OperationError('Origen de despliegue no autorizado')
    if run.get('head_branch') != 'main' or run.get('event') != 'push' or run.get('path') != '.github/workflows/dev.yml':
        raise OperationError('Solo se admite la CI de push de main')
    if run.get('status') not in ('in_progress', 'completed') or (run.get('status') == 'completed' and run.get('conclusion') != 'success'):
        raise OperationError('Ejecución cancelada, fallida o sin estado verificable')
    if manifest.get('runId') != run.get('id'):
        raise OperationError('Evidencia de CI ajena al manifiesto')
    by_name = {job['name']: job for job in jobs}
    if any(by_name.get(name, {}).get('conclusion') != 'success' for name in CHECKS):
        raise OperationError('Prueba obligatoria ausente, cancelada o fallida')
    if manifest.get('configHash') != expected_config:
        raise OperationError('La configuración debe instalarse y revisarse antes de desplegar')
    if not re.fullmatch(r'ghcr\.io/miguel-garciaa/foodtruck-api@sha256:[0-9a-f]{64}', manifest.get('image', '')):
        raise OperationError('Imagen fuera del registro o sin digest')
    if not re.fullmatch(r'[0-9a-f]{64}', manifest.get('migrationHash', '')):
        raise OperationError('Falta identidad de migraciones')
    return manifest


def alarm_transition(previous, healthy, now, failures=3, successes=2):
    state = dict(previous or {})
    state['failed'] = 0 if healthy else state.get('failed', 0) + 1
    state['passed'] = state.get('passed', 0) + 1 if healthy else 0
    kind = None
    if not state.get('incident') and state['failed'] >= failures:
        state['incident'] = now
        kind = 'incidencia'
    elif state.get('incident') and state['passed'] >= successes:
        kind = 'recuperacion'
    elif state.get('incident') and not healthy and now - state.get('notified', 0) >= 86400:
        kind = 'recordatorio'
    if kind:
        state['pending'] = {'kind': kind, 'incident': state['incident'], 'created': now, 'day': int(now // 86400) if kind == 'recordatorio' else 0}
    return state


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *_args, **_kwargs):
        return None


def request(url, token=None, body=None, headers=None):
    payload = None if body is None else json.dumps(body).encode()
    extra = {'Accept': 'application/vnd.github+json', 'User-Agent': 'Foodtrucks-DEV-ops/1'}
    if token:
        extra['Authorization'] = 'Bearer ' + token
    if body is not None:
        extra['Content-Type'] = 'application/json'
    extra.update(headers or {})
    req = urllib.request.Request(url, data=payload, headers=extra)
    try:
        with urllib.request.build_opener(NoRedirect).open(req, timeout=20) as response:
            return json.load(response)
    except (urllib.error.URLError, ValueError) as error:
        # Response bodies and URLs can contain credentials or business data; do not log them.
        raise OperationError('Petición operativa fallida') from error


class Ops:
    def __init__(self, config):
        self.config = config
        self.root = Path(config['runtime'])
        self.state = Path(config['state'])
        self.state.mkdir(parents=True, exist_ok=True, mode=0o700)

    def secret(self, name):
        path = Path(self.config[name])
        if path.stat().st_mode & 0o077:
            raise OperationError('Credencial con permisos demasiado amplios')
        return path.read_text().strip()

    def run(self, args, **kwargs):
        try:
            return subprocess.run(args, check=True, timeout=kwargs.pop('timeout', 180),
                                  stdout=kwargs.pop('stdout', subprocess.PIPE), stderr=subprocess.PIPE, **kwargs).stdout
        except (subprocess.SubprocessError, OSError) as error:
            raise OperationError('Falló una operación local; consultar el procedimiento') from error

    def compose(self, *args, image=None, **kwargs):
        env = dict(os.environ, DOCKER_CONFIG=self.config['dockerConfig'])
        if image:
            env['FOODTRUCKS_IMAGE'] = image
        elif (self.state / 'current.json').exists():
            env['FOODTRUCKS_IMAGE'] = load(self.state / 'current.json')['image']
        else:
            env['FOODTRUCKS_IMAGE'] = self.config.get('bootstrapImage', 'foodtrucks-dev:local')
        return self.run(['docker', 'compose', '--project-directory', str(self.root), '-p', 'foodtrucks-dev',
                         '-f', str(self.root / 'compose.yaml'), '-f', str(self.root / 'compose.tunnel.yaml'),
                         '-f', str(self.root / 'compose.release.yaml'), *args], env=env, **kwargs)

    @contextlib.contextmanager
    def lock(self, name='operations', wait=False):
        import fcntl
        with (self.state / (name + '.lock')).open('a') as handle:
            try:
                fcntl.flock(handle, fcntl.LOCK_EX | (0 if wait else fcntl.LOCK_NB))
            except BlockingIOError as error:
                raise OperationBusy('Otra operación está en curso') from error
            yield

    def api(self, path, body=None):
        return request('https://api.github.com/repos/miguel-garciaa/Foodtruck/' + path,
                       self.secret('githubToken'), body)

    def alert(self, family, healthy, immediate=False, test=False):
        with self.lock('alarm-' + family, wait=True):
            self._alert(family, healthy, immediate, test)

    def _alert(self, family, healthy, immediate=False, test=False):
        now = int(time.time())
        path = self.state / ('alarms-test' if test else 'alarms') / (family + '.json')
        state = load(path, {})
        if not state.get('pending'):
            state = alarm_transition(state, healthy, now, failures=1 if immediate else 3)
            atomic(path, state)
        event = state.get('pending')
        if not event:
            return
        if now - event['created'] > 23 * 3600:
            raise OperationError('Entrega pendiente fuera de ventana idempotente; requiere revisión')
        title, impact, action = FAMILIES[family]
        label = {'incidencia': 'ALERTA', 'recordatorio': 'RECORDATORIO', 'recuperacion': 'RECUPERACIÓN'}[event['kind']]
        current = load(self.state / 'current.json', {})
        body = event.get('mail') or {'from': self.config['mailFrom'], 'to': [self.config['alertTo']],
                'subject': f"{'[PRUEBA] ' if test else ''}[Foodtrucks DEV] {label}: {title}",
                'text': f"Entorno: DEV\nSeñal: {title}\nHora de Madrid: {dt.datetime.fromtimestamp(event['created'], ZoneInfo('Europe/Madrid')).isoformat()}\nRelease: {current.get('sha', 'no disponible')}\nImpacto: {'Servicio recuperado.' if event['kind'] == 'recuperacion' else impact}\nAcción: {action}\n"}
        event['mail'] = body
        atomic(path, state)
        key = f"foodtrucks-{'test-' if test else ''}{family}-{event['incident']}-{event['kind']}-{event['day']}"
        request('https://api.resend.com/emails', self.secret('resendToken'), body, {'Idempotency-Key': key})
        state.pop('pending')
        state['notified'] = now
        if event['kind'] == 'recuperacion':
            state['incident'] = None
        atomic(path, state)

    def disk(self):
        if shutil.disk_usage(self.root).free < self.config.get('minimumFreeBytes', 3 * 1024**3):
            raise OperationError('Espacio insuficiente; no se borrarán volúmenes ni copias automáticamente')

    def restic(self, *args, **kwargs):
        return self.run(['restic', '--repo', self.config['resticRepository'], '--password-file', self.config['resticPassword'], *args],
                        timeout=1800, **kwargs)

    def backup(self, tag='daily'):
        self.disk()
        scratch = self.state / 'backup-staging'
        scratch.mkdir(exist_ok=True, mode=0o700)
        # Stable paths let daily retention group snapshots correctly. Only private staging is replaced.
        db_size = int(self.compose('exec', '-T', 'db', 'psql', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-Atc', "SELECT pg_database_size('foodtrucks')"))
        if shutil.disk_usage(scratch).free < db_size * 3 + self.config.get('minimumFreeBytes', 3 * 1024**3):
            raise OperationError('Espacio insuficiente para copia y última versión válida')
        media_size = int(self.compose('exec', '-T', 'api', 'du', '-sk', '/app/storage/app/private').split()[0]) * 1024
        if shutil.disk_usage(scratch).free < (db_size + media_size) * 3 + self.config.get('minimumFreeBytes', 3 * 1024**3):
            raise OperationError('Espacio insuficiente para copia completa y restauración')
        with (scratch / 'database.dump').open('wb') as output:
            self.compose('exec', '-T', 'db', 'pg_dump', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-Fc', stdout=output, timeout=1200)
        with (scratch / 'uploads.tar').open('wb') as output:
            self.compose('exec', '-T', 'api', 'tar', '-C', '/app/storage/app/private', '-cf', '-', '.', stdout=output, timeout=1200)
        files = {}
        for name in ('database.dump', 'uploads.tar'):
            with (scratch / name).open('rb') as source:
                files[name] = hashlib.file_digest(source, 'sha256').hexdigest()
        atomic(scratch / 'files.json', files)
        counts = self.compose('exec', '-T', 'db', 'psql', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-Atc',
                              "SELECT json_build_object('migrations',count(*)) FROM migrations")
        atomic(scratch / 'counts.json', json.loads(counts))
        # Include secrets encrypted by Restic: APP_KEY is required to recover encrypted outbox/tokens.
        paths = [str(scratch), str(self.root / '.private'), str(self.root / 'compose.yaml')]
        if (self.state / 'current.json').exists():
            paths.append(str(self.state / 'current.json'))
        self.restic('backup', *paths, '--tag', tag, '--host', 'foodtrucks-dev', '--json')
        self.restic('check')
        atomic(self.state / 'backup.json', {'time': int(time.time()), 'tag': tag})
        # Never prune before a valid backup/check. Retention policies are independent by tag.
        self.restic('forget', '--host', 'foodtrucks-dev', '--tag', 'daily', '--group-by', 'host,tags', '--keep-daily', '7')
        self.restic('forget', '--host', 'foodtrucks-dev', '--tag', 'predeploy', '--group-by', 'host,tags', '--keep-last', '2')
        # No broad Docker prune, no volume cleanup and no automatic repository prune on the small DEV disk.

    def smoke(self):
        self.compose('exec', '-T', 'db', 'pg_isready', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks')
        if self.compose('exec', '-T', 'redis', 'redis-cli', 'ping').strip() != b'PONG':
            raise OperationError('Redis no responde')
        self.compose('exec', '-T', 'worker', 'foodtrucks-entrypoint', 'php', 'artisan', 'horizon:status')
        for endpoint in ('up', 'api/v1/foodtrucks'):
            data = request('http://127.0.0.1:8080/' + endpoint, headers={'Accept': 'application/json'})
            if endpoint.endswith('foodtrucks') and not isinstance(data.get('items'), list):
                raise OperationError('Catálogo no disponible')
        running = json.loads(self.compose('ps', '--format', 'json', 'scheduler').decode().strip())
        if running.get('State') != 'running':
            raise OperationError('Scheduler detenido')

    def deploy(self, release):
        self.disk()
        previous = load(self.state / 'current.json')
        allowed = self.config['compatibleMigrationHashes']
        if release['migrationHash'] not in allowed:
            raise OperationError('Migración requiere revisión de compatibilidad; datos preservados')
        self.compose('config', '--quiet', image=release['image'])
        self.compose('pull', 'api', 'worker', 'scheduler', 'migrate', image=release['image'], timeout=1200)
        label = self.run(['docker', 'image', 'inspect', '--format', '{{index .Config.Labels "org.opencontainers.image.revision"}}', release['image']]).decode().strip()
        if label != release['sha']:
            raise OperationError('El digest descargado no corresponde al commit')
        self.backup('predeploy')
        atomic(self.state / 'maintenance.json', {'until': int(time.time()) + 900})
        # Mark before migrations: an interrupted migration is never blindly repeated by the agent.
        atomic(self.state / 'attempt.json', {'sha': release['sha'], 'phase': 'migrating'})
        try:
            self.compose('run', '--rm', '--no-deps', 'migrate', image=release['image'], timeout=600)
            atomic(self.state / 'attempt.json', {'sha': release['sha'], 'phase': 'starting'})
            self.compose('up', '-d', '--no-build', '--no-deps', '--wait', '--wait-timeout', '120', 'api', 'worker', 'scheduler', image=release['image'])
            self.smoke()
            for service in ('api', 'worker', 'scheduler'):
                container = self.compose('ps', '-q', service).decode().strip()
                actual = self.run(['docker', 'inspect', '--format', '{{.Image}}', container]).decode().strip()
                expected = self.run(['docker', 'image', 'inspect', '--format', '{{.Id}}', release['image']]).decode().strip()
                if not actual or actual != expected:
                    raise OperationError('No coincide la imagen realmente ejecutada')
            if previous:
                atomic(self.state / 'previous.json', previous)
            atomic(self.state / 'current.json', release)
            atomic(self.state / 'attempt.json', {'sha': release['sha'], 'phase': 'success'})
        except OperationError:
            # Roll back the image only when the schema is identical. No down or DB restore.
            if previous and previous.get('migrationHash') == release['migrationHash']:
                self.compose('up', '-d', '--no-build', '--no-deps', '--wait', 'api', 'worker', 'scheduler', image=previous['image'])
                self.smoke()
                atomic(self.state / 'attempt.json', {'sha': release['sha'], 'phase': 'rolled-back'})
            raise
        finally:
            atomic(self.state / 'maintenance.json', {'until': 0})

    def agent(self):
        deployments = self.api('deployments?environment=dev&per_page=10')
        main = self.api('branches/main')['commit']['sha']
        for deployment in deployments:
            release = deployment.get('payload', {})
            if isinstance(release, str):
                release = json.loads(release)
            if deployment.get('sha') != main:
                continue
            statuses = self.api(f"deployments/{deployment['id']}/statuses?per_page=1")
            if statuses and statuses[0]['state'] in ('success', 'failure', 'error', 'inactive'):
                return
            run = self.api(f"actions/runs/{release.get('runId', 0)}")
            jobs = self.api(f"actions/runs/{run['id']}/jobs?filter=latest&per_page=100")['jobs']
            validate_release(release, deployment, run, jobs, main, config_hash(self.root))
            current = load(self.state / 'current.json', {})
            attempt = load(self.state / 'attempt.json', {})
            path = f"deployments/{deployment['id']}/statuses"
            if current.get('sha') == release['sha']:
                self.api(path, {'state': 'success', 'description': 'DEV ya ejecuta este digest verificado.', 'auto_inactive': False})
                return
            if attempt.get('sha') == release['sha'] and attempt.get('phase') not in ('success',):
                self.api(path, {'state': 'error', 'description': 'Intento interrumpido o fallido; requiere revisión local.', 'auto_inactive': False})
                return
            self.api(path, {'state': 'in_progress', 'description': 'Comprobando backup, migración y servicios DEV.', 'auto_inactive': False})
            try:
                self.deploy(release)
            except OperationError:
                self.api(path, {'state': 'failure', 'description': 'DEV no aplicado; revisar estado local y rollback compatible.', 'auto_inactive': False})
                self.alert('deployment', False, immediate=True)
                raise
            self.api(path, {'state': 'success', 'description': 'DEV comprobado: API, DB, Redis, workers y digest.', 'auto_inactive': False})
            self.alert('deployment', True)
            return

    def monitor(self):
        now = int(time.time())
        self.alert('disk', shutil.disk_usage(self.root).free >= self.config.get('minimumFreeBytes', 3 * 1024**3))
        self.alert('backup', now - load(self.state / 'backup.json', {}).get('time', 0) < 30 * 3600)
        self.alert('restore', now - load(self.state / 'restore.json', {}).get('time', 0) < 8 * 86400)
        if load(self.state / 'maintenance.json', {}).get('until', 0) > now:
            return
        try:
            self.smoke()
            healthy = True
        except OperationError:
            healthy = False
        self.alert('services', healthy)
        if healthy:
            value = self.compose('exec', '-T', 'db', 'psql', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-Atc',
                                 "SELECT count(*) FROM outbox_events WHERE status = 'failed' OR (status = 'pending' AND (available_at < now() - interval '15 minutes' OR attempts >= 5))").strip()
            failed = self.compose('exec', '-T', 'db', 'psql', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-Atc', 'SELECT count(*) FROM failed_jobs').strip()
            self.alert('queues', value == b'0' and failed == b'0')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=['agent', 'monitor', 'backup', 'restore-check', 'alarm-test'])
    parser.add_argument('--config', default='/etc/foodtrucks/ops.json')
    args = parser.parse_args()
    os.umask(0o077)
    ops = Ops(load(args.config))
    try:
        with ops.lock('monitor' if args.operation == 'monitor' else 'operations'):
            if args.operation == 'alarm-test':
                for family in FAMILIES:
                    ops.alert(family, False, immediate=True, test=True)
                    ops.alert(family, False, test=True)  # deduplication
                    ops.alert(family, True, test=True)
                    ops.alert(family, True, test=True)  # recovery
            elif args.operation == 'restore-check':
                from restore import restore_check
                restore_check(ops)
            else:
                getattr(ops, args.operation)()
    except OperationBusy:
        print('Operación ya en curso; se comprobará de nuevo en el siguiente intervalo.')
        return 0
    except OperationError as error:
        print(str(error), file=sys.stderr)
        if args.operation in ('backup', 'restore-check'):
            ops.alert('backup' if args.operation == 'backup' else 'restore', False, immediate=True)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
