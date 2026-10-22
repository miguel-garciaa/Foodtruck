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
            if hashlib.file_digest((dump.parent / name).open('rb'), 'sha256').hexdigest() != files[name]:
                raise OperationError('No coincide el contenido restaurado')
        validate_archive(dump.parent / 'uploads.tar')
        name = 'foodtrucks-restore-' + uuid.uuid4().hex
        try:
            ops.run(['docker', 'run', '-d', '--name', name, '--network', 'none', '--memory', '768m',
                     '--pids-limit', '128', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust',
                     '-e', 'POSTGRES_DB=foodtrucks_restore', 'postgis/postgis:17-3.6'])
            for attempt in range(30):
                try:
                    ops.run(['docker', 'exec', name, 'pg_isready', '-U', 'postgres', '-d', 'foodtrucks_restore'])
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
        finally:
            # Only this generated container and its anonymous test volume; never named DEV volumes.
            ops.run(['docker', 'rm', '-fv', name])
        atomic(ops.state / 'restore.json', {'time': int(time.time()), 'verified': True})
