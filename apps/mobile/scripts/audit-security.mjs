import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mobileRoot, verifyPatches } from './dependency-patches.mjs';

const severity = new Map([
  ['info', 0],
  ['low', 1],
  ['moderate', 2],
  ['high', 3],
  ['critical', 4],
]);

export function outstandingVulnerabilities(report, verified, now = new Date()) {
  if (
    report.error ||
    report.auditReportVersion !== 2 ||
    !report.vulnerabilities ||
    !report.metadata?.vulnerabilities ||
    typeof report.vulnerabilities !== 'object' ||
    Array.isArray(report.vulnerabilities)
  ) {
    throw new Error('La auditoría de npm no devolvió un informe completo.');
  }
  for (const patch of verified.values()) {
    if (now >= new Date(patch.reviewBy + 'T00:00:00Z')) {
      throw new Error('Revisión del parche vencida: ' + patch.package);
    }
  }
  const vulnerabilities = new Map(Object.entries(report.vulnerabilities));
  for (const [name, item] of vulnerabilities) {
    if (
      item.name !== name ||
      !severity.has(item.severity) ||
      !Array.isArray(item.via) ||
      item.via.length === 0 ||
      !Array.isArray(item.nodes) ||
      item.nodes.length === 0
    ) {
      throw new Error('Entrada de auditoría incompleta: ' + name);
    }
    for (const via of item.via) {
      if (typeof via === 'string') {
        if (!vulnerabilities.has(via)) throw new Error('Dependencia sin detalle: ' + via);
      } else if (!via || typeof via !== 'object' || typeof via.url !== 'string') {
        throw new Error('Aviso de seguridad sin identificador: ' + name);
      }
    }
  }

  for (const [level] of severity) {
    const count = [...vulnerabilities.values()].filter((item) => item.severity === level).length;
    if (report.metadata.vulnerabilities[level] !== count) {
      throw new Error('Recuento de auditoría incompleto: ' + level);
    }
  }
  if (report.metadata.vulnerabilities.total !== vulnerabilities.size) {
    throw new Error('Recuento total de auditoría incompleto.');
  }

  function advisories(name, seen = new Set()) {
    if (seen.has(name)) return [];
    const next = new Set([...seen, name]);
    const item = vulnerabilities.get(name);
    return item.via.flatMap((via) =>
      typeof via === 'string' ? advisories(via, next) : [{ name, item, advisory: via }],
    );
  }

  function remediated({ name, item, advisory }) {
    const patch = verified.get(name);
    return (
      patch &&
      advisory.name === patch.package &&
      advisory.dependency === patch.package &&
      advisory.url === patch.advisory &&
      item.nodes.every((path) => path === 'node_modules/' + patch.package)
    );
  }

  return [...vulnerabilities.values()].filter((item) => {
    if (severity.get(item.severity) < severity.get('high')) return false;
    const causes = advisories(item.name);
    if (causes.length === 0) throw new Error('Aviso sin causa verificable: ' + item.name);
    return !causes.every(remediated);
  });
}

function audit() {
  const verified = verifyPatches();
  if (!process.env.npm_execpath) throw new Error('Ejecutar con npm run security:audit.');
  const result = spawnSync(
    process.execPath,
    [process.env.npm_execpath, 'audit', '--audit-level=high', '--json'],
    { cwd: mobileRoot, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 },
  );
  if (result.error || ![0, 1].includes(result.status)) {
    throw result.error ?? new Error('No se pudo completar npm audit.');
  }
  // Preserve the complete registry report; it cannot recognise local source patches.
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  const remaining = outstandingVulnerabilities(JSON.parse(result.stdout), verified);
  if (remaining.length) {
    throw new Error('Vulnerabilidades altas/críticas pendientes: ' + remaining.map((v) => v.name));
  }
  console.log(
    'Sin avisos altos/críticos pendientes. Los dos avisos conocidos tienen parches ' +
      'locales verificados; el informe original de npm se conserva arriba.',
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) audit();
