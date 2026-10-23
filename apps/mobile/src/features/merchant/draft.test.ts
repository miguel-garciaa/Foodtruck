import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  blankDraft,
  firstIncompleteStep,
  minuteValue,
  serializeDraft,
  stepIssue,
  timeText,
  validPoint,
} from './draft.ts';

const located = () => ({
  ...blankDraft(),
  longitude: -4.77,
  latitude: 37.88,
  address: 'Puesto de prueba',
  locality: 'Córdoba',
  province: 'Córdoba',
});
const complete = () => ({
  ...located(),
  name: 'Foodtruck de prueba',
  description: 'Cocina de prueba',
  contact: 'Contacto de prueba',
  photos: ['photo-test'],
  menu: [
    { id: 'plato', name: 'Plato de prueba', description: '', priceCents: 500, allergens: 'Gluten' },
  ],
  hours: [{ day: 1, startMinute: 540, endMinute: 1080 }],
});
test('el alta empieza por una ubicación real, sin coordenadas ficticias de guardado', () => {
  assert.equal(firstIncompleteStep(blankDraft()), 0);
  assert.ok(stepIssue({ ...located(), address: ' ' }, 0));
  assert.equal(stepIssue(located(), 0), null);
  for (const point of [
    [0, 0],
    [NaN, 40],
    [-4, Infinity],
    [-20, 40],
    [-4, 50],
  ])
    assert.equal(validPoint(point[0], point[1]), false);
  assert.equal(validPoint(-18, 28), true);
});
test('retoma el primer paso incompleto y alcanza revisión solo con todos los pasos completos', () => {
  const draft = complete();
  assert.equal(firstIncompleteStep(located()), 1);
  assert.equal(firstIncompleteStep({ ...draft, photos: [] }), 2);
  assert.equal(firstIncompleteStep({ ...draft, menu: [] }), 3);
  assert.equal(firstIncompleteStep({ ...draft, menu: [{ ...draft.menu[0], allergens: ' ' }] }), 3);
  assert.equal(firstIncompleteStep({ ...draft, hours: [] }), 4);
  assert.equal(firstIncompleteStep(draft), 5);
});
test('guarda un borrador parcial después de ubicarlo sin exigir fotos ni carta todavía', () => {
  const source = located();
  const next = serializeDraft(source, [], []);
  assert.deepEqual(next, source);
  assert.notEqual(next, source);
  assert.throws(() => serializeDraft(blankDraft(), [], []));
});
test('serializa importes exactos y horarios sin filtrar estado del formulario al contrato', () => {
  const next = serializeDraft(
    complete(),
    [{ ...complete().menu[0], price: '0,29' }],
    [{ key: 'local', day: 1, start: '23:00', end: '24:00' }],
  );
  assert.equal(next.menu[0].priceCents, 29);
  assert.equal('price' in next.menu[0], false);
  assert.deepEqual(next.hours, [{ day: 1, startMinute: 1380, endMinute: 1440 }]);
  assert.equal('key' in next.hours[0], false);
});
test('conserva el origen y rechaza platos incompletos, céntimos inválidos y franjas invertidas', () => {
  const source = complete();
  for (const price of ['', '-1', '0,001'])
    assert.throws(() => serializeDraft(source, [{ ...source.menu[0], price }], []));
  assert.throws(() => serializeDraft(source, [{ ...source.menu[0], name: '', price: '5' }], []));
  for (const [start, end] of [
    ['18:00', '09:00'],
    ['09:00', '09:00'],
    ['24:00', '24:00'],
  ])
    assert.throws(() => serializeDraft(source, [], [{ key: 'x', day: 1, start, end }]));
  assert.equal(source.menu[0].priceCents, 500);
});
test('las horas válidas hacen ida y vuelta y se rechazan formatos ambiguos', () => {
  for (const minutes of [0, 1, 540, 1439, 1440])
    assert.equal(minuteValue(timeText(minutes)), minutes);
  for (const text of ['9:00', '25:00', '12:60', 'no']) assert.throws(() => minuteValue(text));
});
