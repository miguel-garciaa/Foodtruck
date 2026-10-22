import { Button } from '@expo/ui';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { AccountForm } from '@/components/account-form';
import { EmptyState } from '@/components/empty-state';
import { PageShell } from '@/components/page-shell';
import { TruckCard } from '@/components/truck-card';
import { useAccount } from '@/features/account/account-context';
import type { Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { fromApiTruck } from '@/features/discovery/remote';
import type { components } from '@/generated/api';
import { api } from '@/lib/api';
import { useTheme } from '@/theme';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { profile } = useAccount();
  const { favoriteIds, favoriteError, retryFavorites } = useDiscovery();
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const ids = favoriteIds.slice(page * 20, page * 20 + 20).join(',');
  const key = ids + ':' + revision;
  const [state, setState] = useState<{ key: string; items: Truck[]; error: string }>({
    key: '',
    items: [],
    error: '',
  });
  useEffect(() => {
    if (!ids) return;
    const controller = new AbortController();
    const expected = new Set(ids.split(','));
    void api<components['schemas']['Search']>(
      '/foodtrucks?limit=20&ids=' + encodeURIComponent(ids),
      { signal: controller.signal },
      false,
    )
      .then((result) =>
        setState({
          key,
          items: result.items.filter((truck) => expected.has(truck.id)).map(fromApiTruck),
          error: '',
        }),
      )
      .catch(() => {
        if (!controller.signal.aborted)
          setState({ key, items: [], error: 'No pudimos cargar tus foodtrucks guardados.' });
      });
    return () => controller.abort();
  }, [ids, key]);
  const loading = Boolean(ids) && state.key !== key;
  return (
    <PageShell title="Favoritos">
      <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
        Tus paradas guardadas en tu cuenta de Foodtrucks.
      </Text>
      {!profile ? (
        <EmptyState
          icon="favorite-border"
          title="Guarda tus próximas paradas"
          description="Inicia sesión para recuperar tus favoritos en tus dispositivos."
          action="Iniciar sesión"
          onPress={() => router.push('/auth')}
        />
      ) : (
        <>
          {loading && <Text style={{ color: theme.text }}>Cargando favoritos…</Text>}
          {(favoriteError || (state.key === key && state.error)) && (
            <EmptyState
              icon="cloud-off"
              title="No pudimos recuperar tus favoritos"
              description={favoriteError || state.error}
              action="Reintentar"
              onPress={() => {
                retryFavorites();
                setRevision((value) => value + 1);
              }}
            />
          )}
          {state.key === key &&
            state.items.map((truck) => <TruckCard key={truck.id} truck={truck} />)}
          {!loading && favoriteIds.length === 0 && (
            <EmptyState
              icon="favorite-border"
              title="Tu próxima parada empieza aquí"
              description="Toca el corazón de un foodtruck para guardarlo."
              action="Explorar foodtrucks"
              onPress={() => router.navigate('/')}
            />
          )}
          {ids && state.key === key && !state.error && state.items.length === 0 && (
            <Text style={{ color: theme.secondaryText }}>
              Estos foodtrucks ya no están publicados. Tus otros favoritos siguen guardados.
            </Text>
          )}
          <AccountForm>
            {page > 0 && (
              <Button
                label="Anteriores"
                variant="text"
                onPress={() => setPage((value) => value - 1)}
              />
            )}{' '}
            {favoriteIds.length > (page + 1) * 20 && (
              <Button
                label="Más favoritos"
                variant="text"
                onPress={() => setPage((value) => value + 1)}
              />
            )}
          </AccountForm>
        </>
      )}
    </PageShell>
  );
}
