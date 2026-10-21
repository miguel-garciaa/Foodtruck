export const categories = ['Todo', 'Hamburguesas', 'Tacos', 'Vegetariano'] as const;
export type Category = (typeof categories)[number];

export type Truck = {
  id: string;
  name: string;
  category: Exclude<Category, 'Todo'>;
  area: string;
  address: string;
  open: boolean;
  image: 'orange' | 'teal';
  coordinates: [number, number];
  description: string;
  menu: { id: string; name: string; description: string; priceCents: number; allergens: string }[];
};

// Fixtures explícitas: no son negocios, disponibilidad, precios o ubicación reales.
export const demoTrucks: Truck[] = [
  {
    id: 'brasa',
    name: 'Brasa sobre ruedas',
    category: 'Hamburguesas',
    area: 'Centro',
    address: 'Plaza del Encuentro · ubicación de ejemplo',
    open: true,
    image: 'orange',
    coordinates: [-0.3763, 39.4699],
    description:
      'Hamburguesas a la brasa, pan tostado y una carta sencilla para disfrutar a pie de calle.',
    menu: [
      {
        id: 'brasa-clasica',
        name: 'La clásica',
        description: 'Hamburguesa, queso, lechuga y salsa de la casa.',
        priceCents: 950,
        allergens: 'Gluten, leche, huevo y mostaza.',
      },
      {
        id: 'brasa-patatas',
        name: 'Patatas de la casa',
        description: 'Patatas crujientes con especias.',
        priceCents: 450,
        allergens: 'Consultar posibles trazas.',
      },
    ],
  },
  {
    id: 'taco',
    name: 'La ruta del taco',
    category: 'Tacos',
    area: 'Jardines',
    address: 'Paseo de los Jardines · ubicación de ejemplo',
    open: true,
    image: 'teal',
    coordinates: [-0.3693, 39.4752],
    description:
      'Tortillas de maíz, rellenos cocinados despacio y sabores que invitan a compartir.',
    menu: [
      {
        id: 'taco-trio',
        name: 'Trío de tacos',
        description: 'Tres tacos con relleno de verduras, pollo y ternera.',
        priceCents: 1100,
        allergens: 'Leche. Consultar posibles trazas.',
      },
      {
        id: 'taco-guacamole',
        name: 'Totopos con guacamole',
        description: 'Totopos de maíz con guacamole recién preparado.',
        priceCents: 600,
        allergens: 'Consultar posibles trazas.',
      },
    ],
  },
  {
    id: 'verde',
    name: 'Verde y calle',
    category: 'Vegetariano',
    area: 'Centro',
    address: 'Mercado del Barrio · ubicación de ejemplo',
    open: true,
    image: 'teal',
    coordinates: [-0.3824, 39.467],
    description: 'Cocina vegetal, ingredientes de temporada y recetas llenas de color.',
    menu: [
      {
        id: 'verde-bowl',
        name: 'Bowl de temporada',
        description: 'Arroz, verduras asadas, garbanzos y salsa de tahini.',
        priceCents: 1050,
        allergens: 'Sésamo.',
      },
    ],
  },
  {
    id: 'humo',
    name: 'Humo lento',
    category: 'Hamburguesas',
    area: 'Paseo',
    address: 'Paseo del Sol · ubicación de ejemplo',
    open: false,
    image: 'orange',
    coordinates: [-0.3618, 39.4639],
    description: 'Recetas de cocción lenta y bocados para saborear sin prisa.',
    menu: [
      {
        id: 'humo-burger',
        name: 'Hamburguesa ahumada',
        description: 'Hamburguesa, cebolla asada y queso.',
        priceCents: 1350,
        allergens: 'Gluten, leche y mostaza.',
      },
    ],
  },
];

export type DiscoveryFilters = {
  query: string;
  category: Category;
  openOnly: boolean;
  maxPriceCents: number | null;
};

function normalize(value: string) {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}

export function startingPrice(truck: Truck) {
  return Math.min(...truck.menu.map((item) => item.priceCents));
}

export function filterTrucks(trucks: readonly Truck[], filters: DiscoveryFilters) {
  const query = normalize(filters.query);
  return trucks.filter(
    (truck) =>
      (!query || normalize(`${truck.name} ${truck.area} ${truck.category}`).includes(query)) &&
      (filters.category === 'Todo' || truck.category === filters.category) &&
      (!filters.openOnly || truck.open) &&
      (filters.maxPriceCents === null || startingPrice(truck) <= filters.maxPriceCents),
  );
}

export function toggleFavorite(ids: readonly string[], id: string) {
  if (!demoTrucks.some((truck) => truck.id === id)) return [...ids];
  return ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
}

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
