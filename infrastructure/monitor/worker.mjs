import { acknowledged, message, observe } from "./alarm.mjs";

export async function probe(
  env,
  now = Date.now(),
  request = fetch,
  { test = false } = {},
) {
  const target = new URL(env.HEALTH_URL);
  if (
    target.protocol !== "https:" ||
    target.hostname !== "api-dev.foodtruck.bid" ||
    target.pathname !== "/api/v1/foodtrucks"
  )
    throw new Error("Destino de sonda no permitido");
  const stateKey = test ? "test-public-dev" : "public-dev";
  let previous = await env.ALARMS.get(stateKey, "json");
  const deliver = async (event) => {
    if (now - event.created > 23 * 3600000)
      throw new Error(
        "Entrega pendiente fuera de ventana idempotente; requiere revisión",
      );
    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": event.key,
      },
      body: JSON.stringify(event.mail),
    });
    if (!response.ok)
      throw new Error(
        `No se pudo entregar aviso operativo: HTTP ${response.status}`,
      );
    // Separate receipt key avoids KV's one-write-per-key-per-second limit.
    await env.ALARMS.put(`receipt:${event.key}`, "sent", {
      expirationTtl: 172800,
    });
  };
  if (previous?.pending) {
    const event = previous.pending;
    if (!(await env.ALARMS.get(`receipt:${event.key}`))) {
      await deliver(event);
      return;
    }
    previous = acknowledged(previous, event, now);
    delete previous.pending;
  }
  let healthy = false;
  try {
    const response = await request(target.href, {
      headers: { Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    const data = response.ok ? await response.json() : null;
    healthy = Array.isArray(data?.items);
  } catch {
    /* Only the safe signal is reported, never provider response contents. */
  }
  const { state, event } = observe(previous, healthy, now);
  if (event) {
    if (test) event.key = `test-${event.key}`;
    event.mail = {
      from: env.MAIL_FROM,
      to: [env.ALERT_TO],
      ...message(event, { environment: "DEV", target: target.href, test }, now),
    };
    await env.ALARMS.put(
      stateKey,
      JSON.stringify({ ...state, pending: event }),
    );
    await deliver(event);
  } else {
    await env.ALARMS.put(stateKey, JSON.stringify(state));
  }
}

export default {
  async scheduled(_event, env, context) {
    context.waitUntil(probe(env));
  },
  async fetch() {
    return new Response("Sonda interna de Foodtrucks", { status: 404 });
  },
};
