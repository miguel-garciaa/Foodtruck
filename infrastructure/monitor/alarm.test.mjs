import assert from "node:assert/strict";
import { test } from "node:test";
import { acknowledged, message, observe } from "./alarm.mjs";
import { probe } from "./worker.mjs";

test("tres fallos abren una incidencia; no se repite cada cinco minutos", () => {
  let state;
  for (let n = 1; n <= 3; n++) {
    const result = observe(state, false, n * 300000);
    assert.equal(result.event?.kind ?? null, n === 3 ? "incidencia" : null);
    state = result.event
      ? acknowledged(result.state, result.event, n * 300000)
      : result.state;
  }
  assert.equal(observe(state, false, 1200000).event, null);
  assert.equal(
    observe(state, false, 900000 + 86400000).event.kind,
    "recordatorio",
  );
});
test("recuperación exige dos éxitos y una nueva caída crea otra incidencia", () => {
  const previous = { incident: 1, failed: 3, notified: 1 };
  const first = observe(previous, true, 1000);
  assert.equal(first.event, null);
  const second = observe(first.state, true, 2000);
  assert.equal(second.event.kind, "recuperacion");
  assert.equal(acknowledged(second.state, second.event, 2000).incident, null);
});
test("un reintento conserva la clave idempotente y no expone secretos", () => {
  const previous = { failed: 2 };
  const a = observe(previous, false, 1000);
  assert.equal(a.event.key, observe(previous, false, 1000).event.key);
  const mail = message(
    a.event,
    { environment: "DEV", target: "https://api-dev.foodtruck.bid", test: true },
    1000,
  );
  assert.match(mail.subject, /^\[PRUEBA\]/);
  assert.match(mail.text, /Hora de Madrid|Acción/);
});
test("fallo de Resend no acredita entrega ni borra la incidencia", async () => {
  let stored = null;
  const env = {
    HEALTH_URL: "https://api-dev.foodtruck.bid/api/v1/foodtrucks",
    ALARMS: {
      get: async () => ({ failed: 2 }),
      put: async (_, value) => {
        stored = value;
      },
    },
  };
  await assert.rejects(
    () =>
      probe(env, 1000, async (url) => ({
        ok: false,
        status: String(url).includes("resend") ? 503 : 502,
      })),
    /HTTP 503/,
  );
  assert.equal(JSON.parse(stored).pending.kind, "incidencia");
});
test("sonda rechaza redirecciones, HTML y destinos ajenos", async () => {
  const writes = [];
  const env = {
    HEALTH_URL: "https://api-dev.foodtruck.bid/api/v1/foodtrucks",
    ALARMS: {
      get: async () => null,
      put: async (_, value) => writes.push(JSON.parse(value)),
    },
  };
  await probe(env, 1000, async (_, options) => {
    assert.equal(options.redirect, "error");
    return {
      ok: true,
      json: async () => ({ arbitrary: "HTML disguised as JSON" }),
    };
  });
  assert.equal(writes[0].failed, 1);
  await assert.rejects(
    () => probe({ ...env, HEALTH_URL: "https://example.test/" }),
    /no permitido/,
  );
});
test("entrega pendiente conserva su clave tras perder respuesta y se confirma con recibo persistente", async () => {
  const values = new Map([["public-dev", { failed: 2 }]]);
  const sent = [];
  const bodies = [];
  const env = {
    HEALTH_URL: "https://api-dev.foodtruck.bid/api/v1/foodtrucks",
    ALARMS: {
      get: async (key, format) => {
        const value = values.get(key);
        return format === "json" ? structuredClone(value) : value;
      },
      put: async (key, value) =>
        values.set(key, key === "public-dev" ? JSON.parse(value) : value),
    },
  };
  let fail = true;
  const request = async (url, options) => {
    if (String(url).includes("resend")) {
      sent.push(options.headers["Idempotency-Key"]);
      bodies.push(options.body);
      if (fail) throw new Error("timeout after delivery");
      return { ok: true };
    }
    return { ok: false };
  };
  await assert.rejects(() => probe(env, 1000, request));
  fail = false;
  await probe(env, 301000, request);
  assert.deepEqual(sent, [sent[0], sent[0]]);
  assert.deepEqual(bodies, [bodies[0], bodies[0]]);
  await probe(env, 601000, request);
  assert.equal(sent.length, 2);
});
