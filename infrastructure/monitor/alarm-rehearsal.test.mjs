import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rehearse } from "./alarm-test.mjs";

test("ensayo externo aísla tres fallos, envía solo seis avisos de prueba y no repite al reanudar", async () => {
  const state = await mkdtemp(join(tmpdir(), "probe-rehearsal-"));
  try {
    const sent = [];
    const keys = [];
    const send = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      sent.push(JSON.parse(options.body));
      keys.push(options.headers["Idempotency-Key"]);
      return { ok: true };
    };
    const config = {
      state,
      resendKey: "synthetic-token",
      mailFrom: "ops@example.test",
      alertTo: "owner@example.test",
    };
    await rehearse(config, send);
    await rehearse(config, send);
    assert.equal(sent.length, 6);
    assert.equal(new Set(keys).size, 6);
    assert.equal(
      sent.filter((mail) => mail.subject.includes("RECUPERACIÓN")).length,
      3,
    );
    assert.ok(sent.every((mail) => mail.subject.startsWith("[PRUEBA]")));
  } finally {
    await rm(state, { recursive: true, force: true });
  }
});
