"""Real encrypted backup/restore rehearsal, restricted to the disposable Actions DB."""
import json
import os
from pathlib import Path
import re
import sys
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'infrastructure/ops'))
from ops import Ops, atomic
from restore import restore_check

if os.environ.get('GITHUB_ACTIONS') != 'true':
    raise SystemExit('Ensayo exclusivo del runner desechable de GitHub')
container = os.environ['TEST_POSTGRES_CONTAINER']
if not re.fullmatch(r'[a-f0-9]{12,64}', container):
    raise SystemExit('Identidad de servicio no válida')


class FixtureOps(Ops):
    def compose(self, *args, **kwargs):
        if args[:3] == ('exec', '-T', 'db'):
            command = [arg.replace('foodtrucks_migrator', 'postgres').replace('foodtrucks', 'foodtrucks_testing') for arg in args[3:]]
            return self.run(['docker', 'exec', container, *command], **kwargs)
        if args[:4] == ('exec', '-T', 'api', 'du'):
            return b'1\t/synthetic-media\n'
        if args[:4] == ('exec', '-T', 'api', 'tar'):
            return self.run(['tar', '-C', str(self.root / 'synthetic-media'), '-cf', '-', '.'], **kwargs)
        raise AssertionError('El ensayo no puede operar otros servicios')


with tempfile.TemporaryDirectory(prefix='foodtrucks-backup-ci-') as directory:
    root = Path(directory)
    (root / '.private').mkdir(mode=0o700)
    (root / '.private/app-key').write_text('synthetic-key-for-restore-fixture')
    (root / 'synthetic-media').mkdir()
    (root / 'synthetic-media/synthetic.jpg').write_bytes(b'synthetic image bytes')
    (root / 'compose.yaml').write_text('# synthetic backup fixture\n')
    password = root / 'restic-password'
    password.write_text(os.urandom(48).hex())
    password.chmod(0o600)
    ops = FixtureOps({'runtime': str(root), 'state': str(root / 'state'), 'resticRepository': str(root / 'repository'),
                      'resticPassword': str(password), 'minimumFreeBytes': 64 * 1024**2})
    info = json.loads(ops.run(['docker', 'inspect', '--format', '{{json .Config.Env}}', container]))
    if 'POSTGRES_DB=foodtrucks_testing' not in info:
        raise SystemExit('El servicio no es la base CI autorizada')
    ops.compose('exec', '-T', 'db', 'psql', '-U', 'foodtrucks_migrator', '-d', 'foodtrucks', '-v', 'ON_ERROR_STOP=1', '-c',
                "INSERT INTO users(id,name,email,password) VALUES ('00000000-0000-4000-8000-000000000001','Synthetic restore','restore@example.test','synthetic-only')")
    ops.restic('init')
    atomic(ops.state / 'current.json', {'sha': 'synthetic-ci'})
    ops.backup('daily')
    restored = restore_check(ops)
    assert restored['users'] == 1, 'No se conserva la cuenta sintética en la base restaurada'
    assert json.loads((ops.state / 'restore.json').read_text())['verified'] is True
    print('Backup cifrado, integridad de fotos y restauración PostgreSQL aislada: correctos.')
