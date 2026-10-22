import assert from 'node:assert/strict';
import { test } from 'node:test';
import { notificationTarget } from './notification-target.ts';

const userId = '10000000-0000-4000-8000-000000000001';
const eventId = '20000000-0000-4000-8000-000000000001';
const truckId = '30000000-0000-4000-8000-000000000001';
test('un aviso solo abre el contexto de su cuenta y acepta la prueba sin anuncio', () => {
  assert.deepEqual(notificationTarget({ userId, eventId, truckId }, userId), { eventId, truckId });
  assert.deepEqual(notificationTarget({ userId, eventId, truckId: '' }, userId), {
    eventId,
    truckId: null,
  });
  assert.equal(notificationTarget({ userId: 'otra-cuenta', eventId, truckId }, userId), null);
});
test('los datos push no pueden elegir una URL o una ruta arbitraria', () => {
  assert.equal(
    notificationTarget({ userId, eventId, truckId: 'https://untrusted.example' }, userId),
    null,
  );
  assert.equal(notificationTarget({ userId, eventId: 'invalid', truckId }, userId), null);
  assert.equal(notificationTarget({}, userId), null);
});
