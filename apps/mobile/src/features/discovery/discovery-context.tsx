import { createContext, use, useState, type ReactNode } from 'react';

import { demoTrucks, filterTrucks, toggleFavorite, type DiscoveryFilters } from './catalog';

const initialFilters: DiscoveryFilters = {
  query: '',
  category: 'Todo',
  openOnly: false,
  maxPriceCents: null,
};

function useDiscoveryState() {
  const [filters, setFilters] = useState(initialFilters);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  return {
    filters,
    setFilters,
    results: filterTrucks(demoTrucks, filters),
    favoriteIds,
    toggleSaved: (id: string) => setFavoriteIds((ids) => toggleFavorite(ids, id)),
    clearFilters: () => setFilters(initialFilters),
  };
}

const DiscoveryContext = createContext<ReturnType<typeof useDiscoveryState> | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  return <DiscoveryContext value={useDiscoveryState()}>{children}</DiscoveryContext>;
}

export function useDiscovery() {
  const value = use(DiscoveryContext);
  if (!value) throw new Error('DiscoveryProvider no está disponible');
  return value;
}
