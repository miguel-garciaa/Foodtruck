import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";

const exec = promisify(execFile);
const workflow = await readFile(
  new URL("../workflows/dev.yml", import.meta.url),
  "utf8",
);
const match = workflow.match(
  /node --input-type=module <<'NODE'\r?\n([\s\S]*?)^ {10}NODE\s*$/m,
);
assert.ok(
  match,
  "El workflow debe contener el programa real que publica el informe",
);
const source = match[1].replace(/^ {10}/gm, "");
const sha = "a".repeat(40);
const checks = {
  secrets: "Detección de secretos",
  laravel: "Cuentas, permisos y servidor",
  mobile: "Comprobaciones de la app",
  "mobile-security": "Seguridad de dependencias de la app",
};

async function report(
  t,
  { results = {}, missing, unavailable, title, push = false, mismatch } = {},
) {
  const directory = await mkdtemp(join(tmpdir(), "foodtrucks-ci-report-"));
  assert.equal(dirname(directory), resolve(tmpdir()));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const eventFile = join(directory, "event.json");
  const summaryFile = join(directory, "summary.md");
  const outcome = Object.fromEntries(
    Object.keys(checks)
      .filter((id) => id !== missing)
      .map((id) => [id, { result: results[id] ?? "success" }]),
  );
  const jobs = Object.entries(checks).map(([id, name], index) => ({
    id: index + 1,
    name,
    conclusion: mismatch === id ? "cancelled" : outcome[id]?.result,
    steps:
      id === "mobile-security" && results[id] === "failure"
        ? [
            {
              name: "Detectar vulnerabilidades altas o críticas en dependencias de la app",
              conclusion: "failure",
            },
          ]
        : [],
  }));
  await writeFile(
    eventFile,
    JSON.stringify(
      push
        ? { head_commit: { message: "Cambio en main" } }
        : { pull_request: { title: "Una PR" } },
    ),
  );
  const fixture = {
    jobs,
    commit: {
      message:
        title ??
        "ci: explicar los resultados de las pruebas\n\nCuerpo del commit",
    },
    unavailable,
  };
  const fakeApi = `
    const fixture = JSON.parse(process.env.CI_FIXTURE);
    globalThis.fetch = async (url) => {
      if (fixture.unavailable) throw new Error('Error de red con un secreto que no debe publicarse');
      return { ok: true, json: async () => url.includes('/jobs?') ? { jobs: fixture.jobs } : { commit: fixture.commit } };
    };
  `;
  let exitCode = 0;
  try {
    await exec(
      process.execPath,
      ["--input-type=module", "--eval", fakeApi + source],
      {
        env: {
          ...process.env,
          GH_TOKEN: "synthetic-token-never-in-summary",
          CI_FIXTURE: JSON.stringify(fixture),
          CI_RESULTS: JSON.stringify(outcome),
          GITHUB_EVENT_PATH: eventFile,
          GITHUB_STEP_SUMMARY: summaryFile,
          GITHUB_REPOSITORY: "example/foodtrucks",
          GITHUB_RUN_ID: "42",
          GITHUB_SERVER_URL: "https://github.com",
          GITHUB_API_URL: "https://api.github.com",
          HEAD_SHA: sha,
          CHECKED_SHA: "b".repeat(40),
        },
      },
    );
  } catch (error) {
    if (typeof error.code !== "number") throw error;
    exitCode = error.code;
  }
  return { exitCode, text: await readFile(summaryFile, "utf8") };
}

test("éxito: explica el cambio, las pruebas, el commit y los límites", async (t) => {
  const result = await report(t);
  assert.equal(result.exitCode, 0);
  assert.match(result.text, /todas las comprobaciones configuradas han pasado/);
  assert.equal((result.text.match(/\| Superada \|/g) ?? []).length, 4);
  assert.match(result.text, /ci: explicar los resultados de las pruebas/);
  assert.doesNotMatch(result.text, /Cuerpo del commit|synthetic-token/);
  assert.ok(result.text.includes(`/commit/${sha}`));
  assert.match(result.text, /integración de la PR/);
  assert.match(
    result.text,
    /no acreditan un recorrido completo en un teléfono ni pagos/,
  );
});

test("fallo: señala la auditoría que falló y bloquea el resultado general", async (t) => {
  const result = await report(t, { results: { "mobile-security": "failure" } });
  assert.equal(result.exitCode, 1);
  assert.match(result.text, /\| Fallida \|/);
  assert.match(result.text, /Detectar vulnerabilidades altas o críticas/);
  assert.match(result.text, /runs\/42\/job\/4/);
  assert.match(result.text, /cambio pendiente de corregir o verificar/);
  assert.doesNotMatch(
    result.text,
    /todas las comprobaciones configuradas han pasado/,
  );
});

for (const [state, label] of [
  ["cancelled", "Cancelada"],
  ["skipped", "No ejecutada"],
]) {
  test(`${state}: no presenta una prueba incompleta como superada`, async (t) => {
    const result = await report(t, { results: { laravel: state } });
    assert.equal(result.exitCode, 1);
    assert.ok(result.text.includes(`| ${label} |`));
    assert.match(result.text, /necesita una ejecución completa/);
  });
}

test("una comprobación ausente bloquea y muestra que falta su resultado", async (t) => {
  const result = await report(t, { missing: "secrets" });
  assert.equal(result.exitCode, 1);
  assert.match(result.text, /Resultado no disponible/);
});

test("un fallo de la API deja el informe incompleto y no expone el error ni el token", async (t) => {
  const result = await report(t, { unavailable: true });
  assert.equal(result.exitCode, 1);
  assert.match(result.text, /informe queda incompleto/);
  assert.doesNotMatch(result.text, /un secreto|synthetic-token/);
});

test("los metadatos no pueden insertar HTML, enlaces o filas de tabla", async (t) => {
  const result = await report(t, {
    title:
      "<script>alert(1)</script> | [enlace](https://example.test) `texto`\nOtra fila",
  });
  assert.equal(result.exitCode, 0);
  assert.doesNotMatch(result.text, /<script>|\[enlace\]|`texto`|Otra fila/);
  assert.match(result.text, /&#60;script&#62;/);
  assert.match(result.text, /&#124;/);
});

test("un detalle de trabajos inconsistente nunca produce un informe verde", async (t) => {
  const result = await report(t, { mismatch: "laravel" });
  assert.equal(result.exitCode, 1);
  assert.match(result.text, /informe queda incompleto/);
});

test("la ejecución de main no se presenta como una integración de PR", async (t) => {
  const result = await report(t, { push: true });
  assert.equal(result.exitCode, 0);
  assert.doesNotMatch(result.text, /integración de la PR/);
});
