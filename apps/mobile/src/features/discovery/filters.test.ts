import assert from 'node:assert/strict';
import { test } from 'node:test';
import { changedLocality, filterCount, initialFilters } from './filters.ts';
import { searchQuery } from './remote.ts';

test('el contador agrupa el rango de precio y la localidad y cuenta comida y valoración', () => {
  assert.equal(filterCount(initialFilters), 0);
  assert.equal(
    filterCount({
      ...initialFilters,
      category: 'Tacos',
      minPriceCents: 0,
      maxPriceCents: 500,
      locality: 'Córdoba',
      province: 'Córdoba',
      minRating: 4.5,
      openOnly: true,
    }),
    5,
  );
});
test('cambiar localidad requiere nueva área; acentos, espacios o precio no la reinician', () => {
  const previous = { ...initialFilters, locality: ' Córdoba ', province: 'Córdoba' };
  assert.equal(
    changedLocality(previous, { ...previous, locality: 'cordoba', maxPriceCents: 500 }),
    false,
  );
  assert.equal(changedLocality(previous, { ...previous, locality: 'Toledo' }), true);
  assert.equal(changedLocality(previous, initialFilters), true);
});
test('restablecer prepara una búsqueda sin los filtros anteriores', () => {
  const active = {
    ...initialFilters,
    category: 'Tacos' as const,
    locality: 'Córdoba',
    minRating: 4 as const,
  };
  const reset = { ...initialFilters };
  assert.equal(new URLSearchParams(searchQuery(active)).get('category'), 'Tacos');
  const query = new URLSearchParams(searchQuery(reset));
  for (const name of [
    'category',
    'minRating',
    'minPriceCents',
    'maxPriceCents',
    'locality',
    'province',
    'q',
  ])
    assert.equal(query.has(name), false);
  assert.equal(active.locality, 'Córdoba');
});
