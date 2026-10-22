import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
  applyPatches,
  mobileRoot,
  patches,
  replaceHunks,
  verifyPatches,
} from './dependency-patches.mjs';
import { outstandingVulnerabilities } from './audit-security.mjs';

const require = createRequire(import.meta.url);
const braces = require('braces');
const forge = require('node-forge');

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'foodtrucks-security-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const patch of patches) {
    const directory = join(root, 'node_modules', patch.package);
    mkdirSync(directory, { recursive: true });
    writeFileSync(
      join(directory, 'package.json'),
      JSON.stringify({ name: patch.package, version: patch.version }),
    );
    for (const file of patch.files) {
      const path = join(directory, file.path);
      mkdirSync(dirname(path), { recursive: true });
      const patched = readFileSync(join(mobileRoot, 'node_modules', patch.package, file.path), 'utf8');
      writeFileSync(path, replaceHunks(patched, file.replacements, true));
    }
  }
  return root;
}

test('la instalación aplica los parches de forma idempotente y verifica sus fuentes', (t) => {
  const root = fixture(t);
  assert.throws(() => verifyPatches(root), /Falta aplicar/);
  assert.equal(applyPatches(root).size, 2);
  assert.equal(applyPatches(root).size, 2);
  assert.equal(verifyPatches(root).size, 2);
});

test('un archivo alterado bloquea la instalación antes de escribir otros parches', (t) => {
  const root = fixture(t);
  const first = join(root, 'node_modules/braces/lib/compile.js');
  const original = readFileSync(first, 'utf8');
  const last = join(root, 'node_modules/node-forge/lib/rsa.js');
  writeFileSync(last, readFileSync(last, 'utf8') + '\n// alterado\n');
  assert.throws(() => applyPatches(root), /parche|Fuente/);
  assert.equal(readFileSync(first, 'utf8'), original);
});

test('una versión nueva obliga a revisar el parche', (t) => {
  const root = fixture(t);
  writeFileSync(
    join(root, 'node_modules/braces/package.json'),
    JSON.stringify({ name: 'braces', version: '3.0.4' }),
  );
  assert.throws(() => applyPatches(root), /versión inesperada/);
});

test('un parche alterado no supera la verificación', (t) => {
  const root = fixture(t);
  applyPatches(root);
  const path = join(root, 'node_modules/braces/lib/compile.js');
  writeFileSync(path, readFileSync(path, 'utf8').replace('depth + 1', 'depth'));
  assert.throws(() => verifyPatches(root), /parche|Fuente/);
});

for (const operation of ['parse', 'compile', 'expand', 'stringify']) {
  test('braces rechaza 4000 niveles sin agotar la pila: ' + operation, () => {
    for (const [open, close] of [['{', '}'], ['(', ')']]) {
      const pattern = open.repeat(4000) + 'x' + close.repeat(4000);
      assert.throws(
        () => braces[operation](pattern),
        (error) => error instanceof SyntaxError && /nesting depth/.test(error.message),
      );
    }
  });
}

for (const operation of ['compile', 'expand', 'stringify']) {
  test('braces protege también los AST proporcionados por el llamador: ' + operation, () => {
    let ast = { type: 'root', nodes: [] };
    for (let depth = 0; depth < 4000; depth++) ast = { type: 'root', nodes: [ast] };
    assert.throws(() => braces[operation](ast), /AST nesting depth/);
  });
}

test('braces y micromatch conservan alternativas, rangos, escapes y patrones normales', () => {
  assert.deepEqual(braces.expand('page-{1..3}.js'), ['page-1.js', 'page-2.js', 'page-3.js']);
  assert.deepEqual(braces.expand('a\\{b,c\\}'), ['a{b,c}']);
  assert.equal(braces.compile('app/{one,two}/*.{ts,tsx}'), 'app/(one|two)/*.(ts|tsx)');
  const pattern = '{'.repeat(64) + 'x' + '}'.repeat(64);
  assert.equal(braces.stringify(pattern), pattern);
  assert.deepEqual(braces.expand(pattern), [pattern]);
  assert.deepEqual(
    require('micromatch')(['src/a.ts', 'src/b.tsx', 'src/c.js'], 'src/*.{ts,tsx}'),
    ['src/a.ts', 'src/b.tsx'],
  );
});

const keys = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicExponent: 3,
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
});
const privateKey = forge.pki.privateKeyFromPem(keys.privateKey);
const publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
const digest = forge.md.sha256.create().update('Foodtrucks: prueba sintética');
const hash = digest.digest().getBytes();
const asn1 = forge.asn1;
const node = (type, constructed, value) =>
  asn1.create(asn1.Class.UNIVERSAL, type, constructed, value);
const oid = () => node(asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.sha256).getBytes());
const nil = () => node(asn1.Type.NULL, false, '');
const garbage = () => node(asn1.Type.OCTETSTRING, false, 'garbage');

function signature(algorithm) {
  const info = node(asn1.Type.SEQUENCE, true, [
    node(asn1.Type.SEQUENCE, true, algorithm),
    node(asn1.Type.OCTETSTRING, false, hash),
  ]);
  return privateKey.sign(asn1.toDer(info).getBytes(), 'NONE');
}

test('RSA acepta firmas SHA-256 válidas con parámetros NULL u omitidos', () => {
  assert.equal(publicKey.verify(hash, privateKey.sign(digest)), true);
  assert.equal(publicKey.verify(hash, signature([oid(), nil()])), true);
  assert.equal(publicKey.verify(hash, signature([oid()])), true);
  assert.equal(publicKey.verify('x'.repeat(32), signature([oid(), nil()])), false);
});

test('RSA rechaza elementos sobrantes dentro de DigestAlgorithm', () => {
  for (const algorithm of [
    [oid(), nil(), garbage()],
    [oid(), garbage()],
    [oid(), nil(), nil()],
  ]) {
    assert.throws(() => publicKey.verify(hash, signature(algorithm)), /DigestInfo/);
  }
});

test('el control sin parche reproduce la aceptación del DigestAlgorithm malformado', (t) => {
  const root = fixture(t);
  const directory = join(root, 'node_modules/node-forge');
  cpSync(join(mobileRoot, 'node_modules/node-forge'), directory, { recursive: true });
  const file = patches.find((patch) => patch.package === 'node-forge').files[0];
  const path = join(directory, file.path);
  writeFileSync(path, replaceHunks(readFileSync(path, 'utf8'), file.replacements, true));
  const originalForge = require(join(directory, 'lib/index.js'));
  const originalPublicKey = originalForge.pki.publicKeyFromPem(keys.publicKey);
  assert.equal(originalPublicKey.verify(hash, signature([oid(), nil(), garbage()])), true);
});

test('Expo puede seguir generando identificadores de proyectos con uuid actualizado', () => {
  const xcode = require('xcode');
  const project = xcode.project('synthetic.pbxproj');
  project.hash = { project: { objects: {} } };
  const ids = new Set(Array.from({ length: 20 }, () => project.generateUuid()));
  assert.equal(ids.size, 20);
  for (const id of ids) assert.match(id, /^[A-F0-9]{24}$/);
  const xcodeRequire = createRequire(require.resolve('xcode'));
  assert.equal(xcodeRequire('uuid/package.json').version, '11.1.1');
  assert.throws(
    () => xcodeRequire('uuid').v5('x', xcodeRequire('uuid').v5.DNS, new Uint8Array(8)),
    RangeError,
  );
});

function report(entries) {
  const vulnerabilities = Object.fromEntries(entries.map((entry) => [entry.name, entry]));
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: entries.length };
  for (const entry of entries) counts[entry.severity]++;
  return { auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: counts } };
}

function finding(name, via, nodes = ['node_modules/' + name], severity = 'high') {
  return { name, via, nodes, severity };
}

function advisory(name, url) {
  return { name, dependency: name, url };
}

const verified = verifyPatches();
const now = new Date('2026-10-22T00:00:00Z');
const known = patches.map((patch) =>
  finding(patch.package, [advisory(patch.package, patch.advisory)]),
);
const outstanding = (data) => outstandingVulnerabilities(data, verified, now);

test('la auditoría admite exclusivamente los avisos corregidos y sus dependientes', () => {
  const data = report([
    ...known,
    finding('metro', ['braces', 'expo']),
    finding('expo', ['metro', 'node-forge']),
  ]);
  assert.deepEqual(outstanding(data), []);
});

test('un aviso nuevo sobre el mismo paquete sigue bloqueando', () => {
  const data = report([
    finding('braces', [
      advisory('braces', patches[0].advisory),
      advisory('braces', 'https://github.com/advisories/GHSA-new-risk'),
    ]),
    finding('metro', ['braces']),
  ]);
  assert.deepEqual(outstanding(data).map((item) => item.name), ['braces', 'metro']);
});

test('otro paquete vulnerable alto o crítico sigue bloqueando', () => {
  for (const level of ['high', 'critical']) {
    const data = report([
      ...known,
      finding('other', [advisory('other', 'https://example.invalid/advisory')], undefined, level),
    ]);
    assert.deepEqual(outstanding(data).map((item) => item.name), ['other']);
  }
});

test('una copia anidada sin parche sigue bloqueando', () => {
  const data = report([
    finding('braces', [advisory('braces', patches[0].advisory)], [
      'node_modules/braces',
      'node_modules/other/node_modules/braces',
    ]),
  ]);
  assert.equal(outstanding(data).length, 1);
});

test('fallos de red, informes incompletos, ciclos vacíos y referencias ausentes bloquean', () => {
  for (const data of [
    { error: { code: 'ENETUNREACH' } },
    {},
    report([finding('expo', ['absent'])]),
    report([finding('expo', ['metro']), finding('metro', ['expo'])]),
    report([finding('expo', [])]),
    { ...report([]), metadata: { vulnerabilities: { high: 1 } } },
  ]) {
    assert.throws(() => outstanding(data));
  }
});

test('los parches temporales exigen revisión al vencer el plazo', () => {
  assert.throws(
    () => outstandingVulnerabilities(report(known), verified, new Date('2026-11-21T00:00:00Z')),
    /vencida/,
  );
});

test('un informe válido sin vulnerabilidades pasa', () => {
  assert.deepEqual(outstanding(report([])), []);
});
