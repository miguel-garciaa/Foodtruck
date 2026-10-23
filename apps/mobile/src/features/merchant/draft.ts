import type { components } from '@/generated/api';
import { parseEuros } from '../discovery/remote.ts';

export type Draft = components['schemas']['Draft'];
export type OwnerTruck = components['schemas']['OwnerTruck'];
export const steps = [
  'Ubicación',
  'Tu foodtruck',
  'Fotografías',
  'Carta',
  'Horarios',
  'Revisión',
] as const;
export const foodCategories: Draft['category'][] = [
  'Hamburguesas',
  'Tacos',
  'Vegetariano',
  'Otros',
];
export const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export function blankDraft(): Draft {
  return {
    name: '',
    description: '',
    category: 'Otros',
    contact: '',
    locality: '',
    province: '',
    address: '',
    longitude: 0,
    latitude: 0,
    timezone: 'Europe/Madrid',
    photos: [],
    hours: [],
    menu: [],
  };
}
export function validPoint(longitude: number, latitude: number) {
  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -18.5 &&
    longitude <= 4.7 &&
    latitude >= 27.5 &&
    latitude <= 43.9
  );
}
export function stepIssue(draft: Draft, step: number): string | null {
  if (step === 0) {
    if (!validPoint(draft.longitude, draft.latitude))
      return 'Elige y confirma el punto del puesto en el mapa.';
    if (![draft.address, draft.locality, draft.province].every((value) => value.trim()))
      return 'Completa dirección, localidad y provincia.';
  }
  if (step === 1 && ![draft.name, draft.description, draft.contact].every((value) => value.trim()))
    return 'Completa nombre, descripción y contacto del negocio.';
  if (step === 2 && draft.photos.length === 0)
    return 'Añade al menos una fotografía de tu foodtruck.';
  if (step === 3 && draft.menu.length === 0) return 'Añade al menos un plato a la carta.';
  if (step === 3 && draft.menu.some((item) => !item.name.trim() || !item.allergens.trim()))
    return 'Indica el nombre y la información de alérgenos de cada plato.';
  if (step === 4 && draft.hours.length === 0) return 'Añade al menos una franja de apertura.';
  return null;
}
export function firstIncompleteStep(draft: Draft): number {
  for (let i = 0; i < steps.length - 1; i++) if (stepIssue(draft, i)) return i;
  return steps.length - 1;
}
export function timeText(minutes: number) {
  return (
    String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0')
  );
}
export function minuteValue(value: string): number {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) && value !== '24:00')
    throw new Error('Introduce cada hora con formato HH:MM.');
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}
export type MenuInput = Draft['menu'][number] & { price: string };
export type HoursInput = { key: string; day: number; start: string; end: string };
export function serializeDraft(draft: Draft, menu: MenuInput[], hours: HoursInput[]): Draft {
  if (!validPoint(draft.longitude, draft.latitude))
    throw new Error('Confirma una ubicación dentro del área disponible en DEV.');
  return {
    ...draft,
    menu: menu.map(({ price, ...item }) => {
      const priceCents = parseEuros(price);
      if (priceCents == null) throw new Error('Indica el precio de cada plato.');
      if (!item.name.trim())
        throw new Error('Indica el nombre de cada plato o elimina los platos vacíos.');
      return { ...item, priceCents };
    }),
    hours: hours.map((slot) => {
      const startMinute = minuteValue(slot.start);
      const endMinute = minuteValue(slot.end);
      if (startMinute >= endMinute || startMinute === 1440)
        throw new Error('La hora de cierre debe ser posterior a la de apertura.');
      return { day: slot.day, startMinute, endMinute };
    }),
  };
}
