"""Restore into a unique container with no network, no application, and no active volumes."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import tarfile
import tempfile
import time
import uuid

from ops import OperationError, atomic


def validate_archive(path):
    with tarfile.open(path) as archive:
        for member in archive.getmembers():
            name = PurePosixPath(member.name)
            if name.is_absolute() or '..' in name.parts or member.issym() or member.islnk() or member.isdev():
                raise OperationError('Archivo de backup con rutas o enlaces no permitidos')


def restore_check(ops):
    ops.disk()
    stats = json.loads(ops.restic('stats', 'latest', '--host', 'foodtrucks-dev', '--mode', 'restore-size', '--json'))
    import shutil
    if shutil.disk_usage(ops.state).free < int(stats['total_size']) * 3 + ops.config.get('minimumFreeBytes', 3 * 1024**3):
        raise OperationError('Espacio insuficiente para restauración aislada; última copia preservada')
    ops.restic('check', '--read-data')
    with tempfile.TemporaryDirectory(prefix='foodtrucks-restore-', dir=ops.state) as directory:
        destination = Path(directory)
        ops.restic('restore', 'latest', '--host', 'foodtrucks-dev', '--target', str(destination), '--verify')
        dumps = list(destination.rglob('database.dump'))
        if len(dumps) != 1:
            raise OperationError('Backup incompleto o ambiguo')
        dump = dumps[0]
        files = json.loads((dump.parent / 'files.json').read_text())
        for name in ('database.dump', 'uploads.tar'):
            with (dump.parent / name).open('rb') as source:
                digest = hashlib.file_digest(source, 'sha256').hexdigest()
            if digest != files[name]:
                raise OperationError('No coincide el contenido restaurado')
        validate_archive(dump.parent / 'uploads.tar')
        name = 'foodtrucks-restore-' + uuid.uuid4().hex
        try:
            ops.run(['docker', 'run', '-d', '--name', name, '--network', 'none', '--memory', '1g', '--cpus', '2',
                     '--pids-limit', '128', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust',
                     '-e', 'POSTGRES_DB=foodtrucks_restore', 'postgis/postgis:17-3.6',
                     'postgres', '-c', 'shared_buffers=64MB', '-c', 'maintenance_work_mem=64MB',
                     '-c', 'max_parallel_maintenance_workers=0', '-c', 'max_connections=20'])
            for attempt in range(30):
                try:
                    # The entrypoint's temporary initialization server exposes only a socket.
                    # TCP readiness waits until PostGIS initialization finishes and the final server starts.
                    ops.run(['docker', 'exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres', '-d', 'foodtrucks_restore'])
                    break
                except OperationError:
                    if attempt == 29:
                        raise
                    time.sleep(1)
            with dump.open('rb') as source:
                ops.run(['docker', 'exec', '-i', name, 'pg_restore', '--exit-on-error', '--no-owner', '--no-acl',
                         '-U', 'postgres', '-d', 'foodtrucks_restore'], stdin=source, timeout=1200)
            count = ops.run(['docker', 'exec', name, 'psql', '-U', 'postgres', '-d', 'foodtrucks_restore',
                             '-Atc', 'SELECT count(*) FROM migrations']).strip()
            if not count.isdigit() or int(count) < 1:
                raise OperationError('El esquema restaurado no es válido')
            restored = ops.run(['docker', 'exec', name, 'psql', '-U', 'postgres', '-d', 'foodtrucks_restore', '-Atc',
                                "SELECT json_build_object('migrations',(SELECT count(*) FROM migrations),'users',(SELECT count(*) FROM users),'food_trucks',(SELECT count(*) FROM food_trucks),'media_assets',(SELECT count(*) FROM media_assets))"])
            counts = json.loads(restored)
            if counts['migrations'] != json.loads((dump.parent / 'counts.json').read_text())['migrations']:
                raise OperationError('La base restaurada no conserva el esquema de la copia')
        except OperationError as error:
            # Inspect only the safe resource signal, never dump restored records or SQL.
            try:
                exhausted = ops.run(['docker', 'inspect', '--format', '{{.State.OOMKilled}}', name]).strip() == b'true'
                if not exhausted:
                    counters = ops.run(['docker', 'exec', name, 'cat', '/sys/fs/cgroup/memory.events']).decode().splitlines()
                    exhausted = any(line.split()[0] == 'oom_kill' and int(line.split()[1]) > 0 for line in counters)
            except OperationError:
                exhausted = False
            if exhausted:
                raise OperationError('Restauración detenida por límite de memoria; copia y DEV preservados') from None
            raise error
        finally:
            # Only this generated container and its anonymous test volume; never named DEV volumes.
            ops.run(['docker', 'rm', '-fv', name])
        atomic(ops.state / 'restore.json', {'time': int(time.time()), 'verified': True})
        return counts
