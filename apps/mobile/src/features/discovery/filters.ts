import type { DiscoveryFilters } from './catalog';

export const initialFilters: DiscoveryFilters = {
  query: '',
  category: 'Todo',
  openOnly: false,
  minPriceCents: null,
  maxPriceCents: null,
  locality: '',
  province: '',
  minRating: 0,
};
const normalize = (value = '') =>
  value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
export function changedLocality(previous: DiscoveryFilters, next: DiscoveryFilters) {
  return (
    normalize(previous.locality) !== normalize(next.locality) ||
    normalize(previous.province) !== normalize(next.province)
  );
}
export function filterCount(filters: DiscoveryFilters) {
  return (
    Number(filters.category !== 'Todo') +
    Number(filters.openOnly) +
    Number(filters.minPriceCents != null || filters.maxPriceCents != null) +
    Number(Boolean(filters.locality?.trim() || filters.province?.trim())) +
    Number(Boolean(filters.minRating))
  );
}
