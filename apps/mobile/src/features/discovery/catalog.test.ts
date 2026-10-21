import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  demoTrucks,
  filterTrucks,
  formatPrice,
  startingPrice,
  toggleFavorite,
  type DiscoveryFilters,
} from './catalog.ts';

const defaults: DiscoveryFilters = {
  query: '',
  category: 'Todo',
  openOnly: false,
  maxPriceCents: null,
};

test('sin filtros devuelve todos sin modificar el catálogo', () => {
  const original = structuredClone(demoTrucks);
  assert.equal(filterTrucks(demoTrucks, defaults).length, 4);
  assert.deepEqual(demoTrucks, original);
});

test('la búsqueda ignora mayúsculas, espacios y acentos', () => {
  assert.deepEqual(
    filterTrucks(demoTrucks, { ...defaults, query: '  JARDÍNES ' }).map((truck) => truck.id),
    ['taco'],
  );
  assert.deepEqual(
    filterTrucks(demoTrucks, { ...defaults, query: 'BRASA' }).map((truck) => truck.id),
    ['brasa'],
  );
});

test('combina categoría, texto y disponibilidad con AND', () => {
  assert.deepEqual(
    filterTrucks(demoTrucks, { ...defaults, category: 'Hamburguesas', openOnly: true }).map(
      (truck) => truck.id,
    ),
    ['brasa'],
  );
  assert.deepEqual(
    filterTrucks(demoTrucks, { ...defaults, category: 'Tacos', query: 'brasa' }),
    [],
  );
});

test('respeta el límite entero inclusive del plato más barato', () => {
  assert.equal(startingPrice(demoTrucks[0]), 450);
  assert.deepEqual(
    filterTrucks(demoTrucks, { ...defaults, maxPriceCents: 450 }).map((truck) => truck.id),
    ['brasa'],
  );
  assert.deepEqual(filterTrucks(demoTrucks, { ...defaults, maxPriceCents: 449 }), []);
});

test('búsqueda inexistente no recurre silenciosamente a todos', () => {
  assert.deepEqual(filterTrucks(demoTrucks, { ...defaults, query: 'inexistente' }), []);
});

test('añadir y quitar favoritos conserva el origen sin duplicar', () => {
  const original: string[] = [];
  const saved = toggleFavorite(original, 'brasa');
  assert.deepEqual(original, []);
  assert.deepEqual(saved, ['brasa']);
  assert.deepEqual(toggleFavorite(saved, 'brasa'), []);
});

test('un identificador desconocido no crea favoritos huérfanos', () => {
  assert.deepEqual(toggleFavorite(['brasa'], '__unknown__'), ['brasa']);
});

test('el catálogo mantiene identificadores únicos e importes enteros positivos', () => {
  assert.equal(new Set(demoTrucks.map((truck) => truck.id)).size, demoTrucks.length);
  for (const truck of demoTrucks) {
    assert.ok(truck.menu.length > 0);
    for (const item of truck.menu)
      assert.ok(Number.isSafeInteger(item.priceCents) && item.priceCents > 0);
  }
  assert.match(formatPrice(950), /9,50\s*€/);
});
