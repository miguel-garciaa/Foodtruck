import copy
import importlib.util
import io
import json
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ops import CHECKS, OperationError, Ops, alarm_transition, atomic, validate_release
from restore import validate_archive


class ReleaseTest(unittest.TestCase):
    def setUp(self):
        self.sha = 'a' * 40
        self.manifest = {'version': 1, 'sha': self.sha, 'runId': 42, 'configHash': 'config',
                         'migrationHash': 'b' * 64, 'image': 'ghcr.io/miguel-garciaa/foodtruck-api@sha256:' + 'c' * 64}
        self.deployment = {'sha': self.sha, 'environment': 'dev', 'creator': {'login': 'github-actions[bot]'}}
        self.run = {'id': 42, 'head_sha': self.sha, 'head_branch': 'main', 'event': 'push', 'path': '.github/workflows/dev.yml', 'status': 'in_progress'}
        self.jobs = [{'name': name, 'conclusion': 'success'} for name in CHECKS]

    def check(self):
        return validate_release(self.manifest, self.deployment, self.run, self.jobs, self.sha, 'config')

    def test_verified_release_is_accepted(self):
        self.assertEqual(self.check(), self.manifest)

    def test_failure_cancel_skip_and_absence_block_promotion(self):
        for state in ['failure', 'cancelled', 'skipped', None]:
            with self.subTest(state=state):
                self.jobs[0]['conclusion'] = state
                with self.assertRaises(OperationError):
                    self.check()
        self.jobs = self.jobs[1:]
        with self.assertRaises(OperationError):
            self.check()

    def test_external_pr_old_sha_wrong_config_or_registry_are_rejected(self):
        cases = [('event', 'pull_request'), ('head_branch', 'fork'), ('head_sha', 'd' * 40), ('path', 'other.yml'), ('status', 'completed')]
        for key, value in cases:
            old = self.run[key]
            self.run[key] = value
            with self.assertRaises(OperationError):
                self.check()
            self.run[key] = old
        for key, value in [('image', 'attacker.test/api@sha256:' + 'c' * 64), ('configHash', 'different'), ('runId', 99)]:
            old = self.manifest[key]
            self.manifest[key] = value
            with self.assertRaises(OperationError):
                self.check()
            self.manifest[key] = old


class AlarmsTest(unittest.TestCase):
    def test_hysteresis_reminder_recovery(self):
        state = {}
        for now in [100, 160, 220]:
            state = alarm_transition(state, False, now)
        self.assertEqual(state['pending']['kind'], 'incidencia')
        state.pop('pending')
        state['notified'] = 220
        self.assertNotIn('pending', alarm_transition(state, False, 280))
        self.assertEqual(alarm_transition(state, False, 86620)['pending']['kind'], 'recordatorio')
        state = alarm_transition(state, True, 300)
        self.assertNotIn('pending', state)
        self.assertEqual(alarm_transition(state, True, 360)['pending']['kind'], 'recuperacion')

    def test_pending_delivery_survives_failure_and_retry_uses_same_key(self):
        with tempfile.TemporaryDirectory() as directory:
            ops = Ops({'runtime': directory, 'state': directory, 'mailFrom': 'ops@example.test', 'alertTo': 'owner@example.test'})
            sent = []
            def send(_url, _token, body, headers):
                sent.append((body, headers))
                if len(sent) == 1:
                    raise OperationError('provider unavailable')
                return {'id': 'synthetic'}
            with patch.object(ops, 'secret', return_value='synthetic-never-log'), patch('ops.request', side_effect=send), patch('ops.time.time', side_effect=[1000, 1060, 1120]):
                with self.assertRaises(OperationError):
                    ops.alert('services', False, immediate=True, test=True)
                ops.alert('services', False, immediate=True, test=True)
                ops.alert('services', False, test=True)
            self.assertEqual(len(sent), 2)
            self.assertEqual(sent[0][1], sent[1][1])
            self.assertEqual(sent[0][0], sent[1][0])
            self.assertTrue(sent[1][0]['subject'].startswith('[PRUEBA]'))
            self.assertNotIn('synthetic-never-log', json.dumps(sent))


class DeployTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.ops = Ops({'runtime': self.temp.name, 'state': self.temp.name, 'compatibleMigrationHashes': ['schema'], 'dockerConfig': self.temp.name})
        self.release = {'sha': 'new', 'image': 'new-image', 'migrationHash': 'schema'}
        self.previous = {'sha': 'previous', 'image': 'previous-image', 'migrationHash': 'schema'}
        atomic(self.ops.state / 'current.json', self.previous)

    def test_incompatible_migration_stops_before_backup_or_mutation(self):
        self.release['migrationHash'] = 'unreviewed'
        with patch.object(self.ops, 'disk'), patch.object(self.ops, 'compose') as compose:
            with self.assertRaises(OperationError):
                self.ops.deploy(self.release)
            compose.assert_not_called()

    def test_startup_failure_rolls_back_only_compatible_image(self):
        for compatible in [True, False]:
            previous = dict(self.previous, migrationHash='schema' if compatible else 'older-schema')
            atomic(self.ops.state / 'current.json', previous)
            with patch.object(self.ops, 'disk'), patch.object(self.ops, 'backup') as backup, patch.object(self.ops, 'run', return_value=b'new\n'), patch.object(self.ops, 'compose', return_value=b'') as compose, patch.object(self.ops, 'smoke', side_effect=[OperationError('startup'), None]):
                with self.assertRaises(OperationError):
                    self.ops.deploy(self.release)
                backup.assert_called_once_with('predeploy')
                rollback_calls = [call for call in compose.call_args_list if call.kwargs.get('image') == 'previous-image']
                self.assertEqual(bool(rollback_calls), compatible)
                self.assertEqual(json.loads((self.ops.state / 'current.json').read_text())['sha'], 'previous')
                self.assertEqual(json.loads((self.ops.state / 'maintenance.json').read_text())['until'], 0)

    def test_success_records_actual_release_and_runs_migrations_once_after_backup(self):
        calls = []
        def compose(*args, **kwargs):
            calls.append(args)
            return b'container-id'
        with patch.object(self.ops, 'disk'), patch.object(self.ops, 'backup', side_effect=lambda _tag: calls.append(('backup',))), patch.object(self.ops, 'run', return_value=b'new\n'), patch.object(self.ops, 'compose', side_effect=compose), patch.object(self.ops, 'smoke'):
            self.ops.deploy(self.release)
        migrations = [index for index, args in enumerate(calls) if args[:2] == ('run', '--rm')]
        self.assertEqual(len(migrations), 1)
        self.assertLess(calls.index(('backup',)), migrations[0])
        self.assertEqual(json.loads((self.ops.state / 'current.json').read_text())['sha'], 'new')
        self.assertEqual(json.loads((self.ops.state / 'previous.json').read_text())['sha'], 'previous')

    def test_same_release_is_acknowledged_without_repeating_deployment(self):
        deployment = {'id': 7, 'sha': 'previous', 'payload': {'runId': 42, 'sha': 'previous'}}
        replies = [[deployment], {'commit': {'sha': 'previous'}}, [], {'id': 42}, {'jobs': []}, {}]
        with patch.object(self.ops, 'api', side_effect=replies) as api, patch('ops.validate_release'), patch('ops.config_hash'), patch.object(self.ops, 'deploy') as deploy:
            self.ops.agent()
        deploy.assert_not_called()
        self.assertEqual(api.call_args.args[1]['state'], 'success')

    def test_offline_github_preserves_the_installed_release(self):
        with patch.object(self.ops, 'api', side_effect=OperationError('network unavailable')), patch.object(self.ops, 'deploy') as deploy:
            with self.assertRaises(OperationError):
                self.ops.agent()
        deploy.assert_not_called()
        self.assertEqual(json.loads((self.ops.state / 'current.json').read_text()), self.previous)

    def test_insufficient_space_does_not_mutate_or_prune_backups(self):
        with patch.object(self.ops, 'disk', side_effect=OperationError('disk full')), patch.object(self.ops, 'restic') as restic, patch.object(self.ops, 'compose') as compose:
            with self.assertRaises(OperationError):
                self.ops.backup()
        restic.assert_not_called()
        compose.assert_not_called()

    @unittest.skipUnless(importlib.util.find_spec('fcntl'), 'Exclusión del host se verifica en Linux')
    def test_second_operation_cannot_take_existing_lock(self):
        other = Ops(self.ops.config)
        with self.ops.lock(), self.assertRaises(OperationError), other.lock():
            pass

    def test_interrupted_attempt_is_not_retried(self):
        atomic(self.ops.state / 'attempt.json', {'sha': 'new', 'phase': 'migrating'})
        deployment = {'id': 7, 'sha': 'new', 'payload': {'runId': 42, 'sha': 'new'}}
        replies = [[deployment], {'commit': {'sha': 'new'}}, [], {'id': 42}, {'jobs': []}, {}]
        with patch.object(self.ops, 'api', side_effect=replies) as api, patch('ops.validate_release'), patch('ops.config_hash'), patch.object(self.ops, 'deploy') as deploy:
            self.ops.agent()
        deploy.assert_not_called()
        self.assertEqual(api.call_args.args[1]['state'], 'error')
        self.assertFalse(json.loads((self.ops.state / 'deployment.json').read_text())['healthy'])

    def test_monitor_preserves_deployment_failure_until_a_verified_recovery(self):
        for healthy in [False, True]:
            atomic(self.ops.state / 'deployment.json', {'healthy': healthy})
            with patch.object(self.ops, 'alert') as alert, patch.object(self.ops, 'smoke'), patch.object(self.ops, 'compose', return_value=b'0'):
                self.ops.monitor()
            self.assertIn(unittest.mock.call('deployment', healthy), alert.call_args_list)

    def test_maintenance_does_not_emit_deployment_recovery(self):
        atomic(self.ops.state / 'deployment.json', {'healthy': True})
        atomic(self.ops.state / 'maintenance.json', {'until': 2000})
        with patch('ops.time.time', return_value=1000), patch.object(self.ops, 'alert') as alert:
            self.ops.monitor()
        self.assertNotIn('deployment', [call.args[0] for call in alert.call_args_list])


class RestoreSafetyTest(unittest.TestCase):
    def test_archive_rejects_traversal_absolute_paths_and_links(self):
        for name, kind in [('../outside', tarfile.REGTYPE), ('/absolute', tarfile.REGTYPE), ('link', tarfile.SYMTYPE)]:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / 'uploads.tar'
                with tarfile.open(path, 'w') as archive:
                    info = tarfile.TarInfo(name)
                    info.type = kind
                    archive.addfile(info, io.BytesIO(b''))
                with self.assertRaises(OperationError):
                    validate_archive(path)

    def test_safe_synthetic_media_archive_is_accepted(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'uploads.tar'
            with tarfile.open(path, 'w') as archive:
                info = tarfile.TarInfo('media/synthetic.jpg')
                info.size = 3
                archive.addfile(info, io.BytesIO(b'jpg'))
            validate_archive(path)


if __name__ == '__main__':
    unittest.main()
