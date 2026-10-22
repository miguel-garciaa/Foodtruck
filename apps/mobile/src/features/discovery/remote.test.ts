import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEuros, searchQuery, spainBounds } from './remote.ts';

test('los precios se convierten a céntimos enteros sin redondeo binario', () => {
  assert.equal(parseEuros('0,29'), 29);
  assert.equal(parseEuros('12.5'), 1250);
  assert.equal(parseEuros('0'), 0);
  assert.equal(parseEuros(' 10000,00 '), 1000000);
  assert.equal(parseEuros(''), null);
  for (const value of ['-1', '1,001', '1.000,00', 'NaN', 'Infinity', '10000.01'])
    assert.throws(() => parseEuros(value));
});
test('la búsqueda conserva todos los filtros y el área visible en una petición', () => {
  const query = new URLSearchParams(
    searchQuery(
      {
        query: ' Tácos ',
        category: 'Tacos',
        openOnly: true,
        minPriceCents: 0,
        maxPriceCents: 500,
        locality: ' Córdoba ',
        province: ' Córdoba ',
        minRating: 4.5,
      },
      [-5, 37, -4, 38],
    ),
  );
  assert.equal(query.get('q'), 'Tácos');
  assert.equal(query.get('category'), 'Tacos');
  assert.equal(query.get('openOnly'), 'true');
  assert.equal(query.get('minPriceCents'), '0');
  assert.equal(query.get('maxPriceCents'), '500');
  assert.equal(query.get('locality'), 'Córdoba');
  assert.equal(query.get('province'), 'Córdoba');
  assert.equal(query.get('minRating'), '4.5');
  assert.equal(query.get('bbox'), '-5,37,-4,38');
});
test('la búsqueda inicial incluye Canarias, Baleares, Ceuta y Melilla', () => {
  for (const [longitude, latitude] of [
    [-18.01, 27.75],
    [4.26, 39.88],
    [-5.32, 35.89],
    [-2.94, 35.29],
  ]) {
    assert.ok(
      longitude >= spainBounds[0] &&
        longitude <= spainBounds[2] &&
        latitude >= spainBounds[1] &&
        latitude <= spainBounds[3],
    );
  }
});
