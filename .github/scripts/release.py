"""Publish/request only an already scanned main artifact; no host command is sent to GitHub."""
import json
import os
from pathlib import Path
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'infrastructure/ops'))
from ops import OperationError, config_hash, migration_hash, request

REPO = 'miguel-garciaa/Foodtruck'
BASE = 'https://api.github.com/repos/' + REPO + '/'


def api(path, body=None):
    return request(BASE + path, os.environ['GH_TOKEN'], body)


def manifest():
    return {'version': 1, 'sha': os.environ['GITHUB_SHA'], 'runId': int(os.environ['GITHUB_RUN_ID']),
            'image': os.environ['RELEASE_IMAGE'], 'configHash': config_hash('.'), 'migrationHash': migration_hash('.'),
            'evidence': f"https://github.com/{REPO}/actions/runs/{os.environ['GITHUB_RUN_ID']}"}


def deploy(environment, release):
    deployment = api('deployments', {'ref': release['sha'], 'environment': environment, 'auto_merge': False,
                                    'required_contexts': [], 'production_environment': environment == 'production',
                                    'description': 'Release verificada de Foodtrucks por digest', 'payload': release})
    api(f"deployments/{deployment['id']}/statuses", {'state': 'queued', 'description': 'Esperando agente saliente del entorno.', 'auto_inactive': False})
    deadline = time.monotonic() + 15 * 60
    while time.monotonic() < deadline:
        states = api(f"deployments/{deployment['id']}/statuses?per_page=1")
        if states and states[0]['state'] in ('success', 'failure', 'error', 'inactive'):
            if states[0]['state'] != 'success':
                raise OperationError('El agente no confirmó un despliegue correcto; consultar el estado de GitHub.')
            return deployment
        time.sleep(15)
    api(f"deployments/{deployment['id']}/statuses", {'state': 'error', 'description': 'Agente desconectado o sin respuesta en 15 minutos.', 'auto_inactive': False})
    raise OperationError('No se recibió confirmación del agente en 15 minutos.')


if __name__ == '__main__':
    try:
        command = sys.argv[1]
        if command == 'manifest':
            Path('artifacts').mkdir(exist_ok=True)
            Path('artifacts/release.json').write_text(json.dumps(manifest(), indent=2) + '\n')
        elif command == 'dev':
            deploy('dev', json.loads(Path('artifacts/release.json').read_text()))
        elif command == 'production':
            # GitHub environment approval is required in addition to these activation conditions.
            for name in ('STAGING_VERIFIED', 'PRODUCTION_HOST_VERIFIED', 'OFFSITE_BACKUPS_VERIFIED', 'PRODUCTION_CONFIG_VERIFIED'):
                if os.environ.get(name) != 'true':
                    raise OperationError('Producción bloqueada: falta staging, servidor, backup externo o configuración verificados.')
            sha = os.environ['PROMOTE_SHA']
            candidates = api(f'deployments?environment=dev&sha={sha}&per_page=10')
            release = None
            for item in candidates:
                states = api(f"deployments/{item['id']}/statuses?per_page=1")
                if states and states[0]['state'] == 'success':
                    release = item['payload']
                    if isinstance(release, str):
                        release = json.loads(release)
                    break
            if not release or release.get('sha') != sha:
                raise OperationError('No existe despliegue DEV correcto de esta release.')
            deploy('production', release)
        else:
            raise OperationError('Operación desconocida')
    except OperationError as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
