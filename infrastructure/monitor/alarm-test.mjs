// Manual rehearsal: simulate only the probe response; send [PRUEBA] via real Resend.
import {
  readFile,
  writeFile,
  mkdir,
  rename,
  rmdir,
  stat,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { probe } from "./worker.mjs";

async function read(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
async function save(path, value) {
  await writeFile(`${path}.new`, JSON.stringify(value), { mode: 0o600 });
  await rename(`${path}.new`, path);
}

export async function rehearse(config, send = fetch) {
  const root = join(config.state, "probe-rehearsal");
  await mkdir(root, { recursive: true, mode: 0o700 });
  await mkdir(join(root, "lock"), { mode: 0o700 });
  try {
    for (const family of ["api", "dns", "tls"]) {
      const directory = join(root, family);
      await mkdir(directory, { mode: 0o700, recursive: true });
      const keyPath = (key) =>
        join(directory, Buffer.from(key).toString("base64url") + ".json");
      const env = {
        HEALTH_URL: "https://api-dev.foodtruck.bid/api/v1/foodtrucks",
        RESEND_API_KEY: config.resendKey,
        MAIL_FROM: config.mailFrom,
        ALERT_TO: config.alertTo,
        ALARMS: {
          get: async (key, type) => {
            const value = await read(keyPath(key));
            return type === "json" && value !== null
              ? JSON.parse(value)
              : value;
          },
          put: async (key, value) => save(keyPath(key), value),
        },
      };
      const progress = join(directory, "progress.json");
      let step = (await read(progress))?.step ?? 0;
      // An extra sample acknowledges the persistent receipt without duplicate mail.
      for (; step < 8; step++) {
        await probe(
          env,
          Date.now(),
          async (url, options) => {
            if (url === env.HEALTH_URL) {
              if (step < 4 && family !== "api")
                throw new Error("Fallo sintético de " + family);
              return { ok: step >= 4, json: async () => ({ items: [] }) };
            }
            const mail = JSON.parse(options.body);
            if (
              url !== "https://api.resend.com/emails" ||
              !mail.subject.startsWith("[PRUEBA]") ||
              !options.headers["Idempotency-Key"].startsWith("test-")
            )
              throw new Error("Envío de prueba no permitido");
            mail.subject = mail.subject.replace(
              "[PRUEBA]",
              `[PRUEBA] [${family.toUpperCase()}]`,
            );
            options.body = JSON.stringify(mail);
            options.headers["Idempotency-Key"] += `-${family}`;
            // No request reaches the real API, DNS or TLS target during this rehearsal.
            return send(url, options);
          },
          { test: true },
        );
        await save(progress, { step: step + 1 });
      }
      const state = await env.ALARMS.get("test-public-dev", "json");
      if (state.incident || state.pending)
        throw new Error("Recuperación todavía no confirmada");
    }
  } finally {
    await rmdir(join(root, "lock"));
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const path = process.argv[2];
    if (
      process.platform === "win32" ||
      !path ||
      (await stat(path)).mode & 0o077
    )
      throw new Error("Configuración privada requerida");
    const config = await read(path);
    if ((await stat(config.resendToken)).mode & 0o077)
      throw new Error("Credencial con permisos demasiado amplios");
    await rehearse({
      ...config,
      resendKey: (await readFile(config.resendToken, "utf8")).trim(),
    });
    process.stdout.write(
      "Ensayos API, DNS y TLS completados; comprobar los seis correos [PRUEBA] en el buzón.\n",
    );
  } catch {
    process.stderr.write(
      "Ensayo incompleto. Revisar configuración, permisos, bloqueo o entrega pendiente; no borrar estado para reenviar a ciegas.\n",
    );
    process.exitCode = 1;
  }
}
