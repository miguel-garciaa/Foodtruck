import type { components } from '@/generated/api';
import type { DiscoveryFilters, Truck } from './catalog';

export type Bounds = [number, number, number, number];
export const spainBounds: Bounds = [-18.5, 27.5, 4.7, 43.9];

export function fromApiTruck(truck: components['schemas']['Truck']): Truck {
  const document = truck.document;
  return {
    id: truck.id,
    name: document.name,
    category: document.category,
    area:
      document.locality === document.province
        ? document.locality
        : `${document.locality}, ${document.province}`,
    address: document.address,
    coordinates: [document.longitude, document.latitude],
    description: document.description,
    menu: document.menu,
    open: truck.open,
    photoUrls: truck.photoUrls,
    startingPriceCents: truck.startingPriceCents,
    rating: truck.rating,
    ratingCount: truck.ratingCount,
  };
}

export function searchQuery(filters: DiscoveryFilters, bounds: Bounds = spainBounds): string {
  const query = new URLSearchParams({ limit: '100', bbox: bounds.join(',') });
  if (filters.query.trim()) query.set('q', filters.query.trim());
  if (filters.category !== 'Todo') query.set('category', filters.category);
  if (filters.openOnly) query.set('openOnly', 'true');
  if (filters.minPriceCents != null) query.set('minPriceCents', String(filters.minPriceCents));
  if (filters.maxPriceCents != null) query.set('maxPriceCents', String(filters.maxPriceCents));
  if (filters.locality?.trim()) query.set('locality', filters.locality.trim());
  if (filters.province?.trim()) query.set('province', filters.province.trim());
  if (filters.minRating) query.set('minRating', String(filters.minRating));
  return query.toString();
}

export function parseEuros(value: string): number | null {
  if (!value.trim()) return null;
  if (!/^\d{1,5}([,.]\d{1,2})?$/.test(value.trim()))
    throw new Error('Escribe el precio con hasta dos decimales.');
  const [whole, decimal = ''] = value.trim().replace(',', '.').split('.');
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
  if (cents > 1000000) throw new Error('El precio máximo permitido es 10.000 €.');
  return cents;
}
