import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import type { components } from '@/generated/api';
import { api } from '@/lib/api';
import { useAccount } from '@/features/account/account-context';
import type { DiscoveryFilters, Truck } from './catalog';
import { fromApiTruck, searchQuery, spainBounds, type Bounds } from './remote';
import { changedLocality, initialFilters } from './filters';

function useDiscoveryState() {
  const account = useAccount();
  const [filters, setFilters] = useState(initialFilters);
  const [bounds, setBounds] = useState<Bounds>(spainBounds);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{
    key: string;
    items: Truck[];
    error: string;
    nextCursor: string | null;
  }>({ key: '', items: [], error: '', nextCursor: null });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteError, setFavoriteError] = useState('');
  const [favoriteRevision, setFavoriteRevision] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const pendingFavorites = useRef(new Set<string>());
  const focusPending = useRef(false);
  const [mapFocus, setMapFocus] = useState<{ id: number; bounds: Bounds } | null>(null);
  function applyFilters(next: DiscoveryFilters) {
    if (changedLocality(filters, next)) {
      setBounds(spainBounds);
      focusPending.current = true;
    }
    setFilters(next);
  }
  const query = searchQuery(filters, bounds);
  const key = query + ':' + revision;
  const userId = account.profile?.id;
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void api<components['schemas']['Search']>(
        '/foodtrucks?' + query,
        { signal: controller.signal },
        false,
      )
        .then((result) => {
          if (controller.signal.aborted) return;
          const items = result.items.map(fromApiTruck);
          if (focusPending.current) {
            focusPending.current = false;
            if (items.length) {
              const longitudes = items.map((item) => item.coordinates[0]);
              const latitudes = items.map((item) => item.coordinates[1]);
              setMapFocus((previous) => ({
                id: (previous?.id ?? 0) + 1,
                bounds: [
                  Math.min(...longitudes),
                  Math.min(...latitudes),
                  Math.max(...longitudes),
                  Math.max(...latitudes),
                ],
              }));
            }
          }
          setState({
            key,
            items,
            error: '',
            nextCursor: result.nextCursor,
          });
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setState({
              key,
              items: [],
              error: 'No pudimos cargar los foodtrucks. Comprueba la conexión y reintenta.',
              nextCursor: null,
            });
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, key]);
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void api<components['schemas']['Favorites']>('/me/favorites', { signal: controller.signal })
      .then((result) => {
        setFavoriteIds(result.items);
        setFavoriteError('');
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setFavoriteError('No pudimos recuperar tus favoritos. Reintenta la conexión.');
      });
    return () => controller.abort();
  }, [userId, favoriteRevision]);
  async function loadMore() {
    if (loadingMore || state.key !== key || !state.nextCursor) return;
    setLoadingMore(true);
    const expected = key;
    try {
      const result = await api<components['schemas']['Search']>(
        '/foodtrucks?' + query + '&cursor=' + encodeURIComponent(state.nextCursor),
        {},
        false,
      );
      setState((previous) =>
        previous.key === expected
          ? {
              ...previous,
              items: [
                ...new Map(
                  [...previous.items, ...result.items.map(fromApiTruck)].map((truck) => [
                    truck.id,
                    truck,
                  ]),
                ).values(),
              ],
              nextCursor: result.nextCursor,
              error: '',
            }
          : previous,
      );
    } catch {
      setState((previous) =>
        previous.key === expected
          ? { ...previous, error: 'No pudimos cargar más resultados. Reintenta la conexión.' }
          : previous,
      );
    } finally {
      setLoadingMore(false);
    }
  }
  async function toggleSaved(id: string) {
    if (!userId) {
      router.push('/auth');
      return;
    }
    if (pendingFavorites.current.has(id)) return;
    pendingFavorites.current.add(id);
    setFavoriteError('');
    const saving = !favoriteIds.includes(id);
    try {
      await api('/me/favorites/' + id, { method: saving ? 'PUT' : 'DELETE' });
      setFavoriteIds((ids) =>
        saving ? [...new Set([...ids, id])] : ids.filter((value) => value !== id),
      );
    } catch {
      setFavoriteError('No se pudo guardar el cambio. Reintenta cuando tengas conexión.');
    } finally {
      pendingFavorites.current.delete(id);
    }
  }
  return {
    filters,
    setFilters,
    applyFilters,
    mapFocus,
    bounds,
    setBounds,
    results: state.key === key ? state.items : [],
    loading: state.key !== key,
    error: state.key === key ? state.error : '',
    nextCursor: state.key === key ? state.nextCursor : null,
    loadingMore,
    loadMore,
    favoriteIds,
    favoriteError,
    toggleSaved,
    retry: () => setRevision((value) => value + 1),
    retryFavorites: () => setFavoriteRevision((value) => value + 1),
    clearFilters: () => {
      setBounds(spainBounds);
      applyFilters(initialFilters);
    },
  };
}
const DiscoveryContext = createContext<ReturnType<typeof useDiscoveryState> | null>(null);
function AccountDiscovery({ children }: { children: ReactNode }) {
  return <DiscoveryContext value={useDiscoveryState()}>{children}</DiscoveryContext>;
}
export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const { profile } = useAccount();
  return <AccountDiscovery key={profile?.id ?? 'guest'}>{children}</AccountDiscovery>;
}
export function useDiscovery() {
  const value = use(DiscoveryContext);
  if (!value) throw new Error('DiscoveryProvider no está disponible');
  return value;
}
