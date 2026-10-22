import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const mobileRoot = fileURLToPath(new URL('../', import.meta.url));
export const patches = JSON.parse(
  readFileSync(new URL('../security/dependency-patches.json', import.meta.url), 'utf8'),
);

function gitBlob(source) {
  const bytes = Buffer.from(source);
  return createHash('sha1')
    .update(Buffer.from('blob ' + bytes.length + '\0'))
    .update(bytes)
    .digest('hex');
}

export function replaceHunks(source, replacements, reverse = false) {
  for (const hunk of reverse ? [...replacements].reverse() : replacements) {
    const before = reverse ? hunk.after : hunk.before;
    const after = reverse ? hunk.before : hunk.after;
    if (source.split(before).length !== 2) {
      throw new Error('El parche no coincide de forma única con la fuente esperada.');
    }
    source = source.replace(before, () => after);
  }
  return source;
}

function inspect(root, apply) {
  const writes = [];
  const verified = new Map();
  for (const patch of patches) {
    const directory = resolve(root, 'node_modules', patch.package);
    const manifest = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'));
    if (manifest.name !== patch.package || manifest.version !== patch.version) {
      throw new Error('Revisar el parche de ' + patch.package + ': versión inesperada.');
    }
    for (const file of patch.files) {
      const path = resolve(directory, file.path);
      const source = readFileSync(path, 'utf8');
      if (gitBlob(source) === file.originalGitBlob) {
        if (!apply) throw new Error('Falta aplicar el parche de seguridad: ' + path);
        writes.push([path, replaceHunks(source, file.replacements)]);
      } else {
        const original = replaceHunks(source, file.replacements, true);
        if (gitBlob(original) !== file.originalGitBlob) {
          throw new Error('Fuente modificada o parche desconocido: ' + path);
        }
      }
    }
    verified.set(patch.package, patch);
  }
  // Inspect every source before changing any file.
  for (const [path, source] of writes) writeFileSync(path, source);
  return verified;
}

export function applyPatches(root = mobileRoot) {
  return inspect(root, true);
}

export function verifyPatches(root = mobileRoot) {
  return inspect(root, false);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === '--check') verifyPatches();
  else if (process.argv.length === 2) applyPatches();
  else throw new Error('Uso: node scripts/dependency-patches.mjs [--check]');
  console.log('Parche de profundidad de braces y validación RSA de node-forge comprobados.');
}
