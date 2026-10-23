import { FormButton as Button } from '@/components/form-button';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { FavoriteHelp } from '@/components/favorite-help';
import { ActionButton } from '@/components/action-button';
import { readFavoriteHelp, rememberFavoriteHelp } from '@/lib/ui-preferences';
import { AccountForm } from '@/components/account-form';
import { EmptyState } from '@/components/empty-state';
import { PageShell } from '@/components/page-shell';
import { TruckCard, truckImageSource } from '@/components/truck-card';
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
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      void readFavoriteHelp().then((seen) => {
        if (!seen && !cancelled)
          timer = setTimeout(() => {
            if (!cancelled) setHelpOpen(true);
          }, 400);
      });
      return () => {
        cancelled = true;
        clearTimeout(timer);
        setHelpOpen(false);
      };
    }, []),
  );
  function closeHelp() {
    setHelpOpen(false);
    void rememberFavoriteHelp();
  }

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
      <ActionButton
        label="Cómo guardar favoritos"
        variant="text"
        onPress={() => setHelpOpen(true)}
      />
      <FavoriteHelp open={helpOpen} onClose={closeHelp} />
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
          {state.key === key && favoriteIds.length > 0 && !state.error && !collectionOpen && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir colección. ${favoriteIds.length} foodtrucks guardados`}
              onPress={() => setCollectionOpen(true)}
              style={{ gap: 12, alignSelf: 'flex-start' }}
            >
              <View
                style={{
                  width: 176,
                  height: 176,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 2,
                  overflow: 'hidden',
                  borderRadius: 22,
                  backgroundColor: theme.selected,
                }}
              >
                {state.items.slice(0, 4).map((truck) => (
                  <Image
                    key={truck.id}
                    source={truckImageSource(truck)}
                    contentFit="cover"
                    style={{ width: 87, height: 87 }}
                  />
                ))}
              </View>
              <Text style={{ color: theme.text, fontSize: 19, fontWeight: '600' }}>
                Mis foodtrucks
              </Text>
              <Text style={{ color: theme.secondaryText }}>{favoriteIds.length} guardados</Text>
            </Pressable>
          )}
          {collectionOpen && (
            <ActionButton
              label="Volver a la colección"
              variant="text"
              onPress={() => {
                setPage(0);
                setCollectionOpen(false);
              }}
            />
          )}
          {collectionOpen &&
            state.key === key &&
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
            {collectionOpen && page > 0 && (
              <Button
                label="Anteriores"
                variant="text"
                onPress={() => setPage((value) => value - 1)}
              />
            )}{' '}
            {collectionOpen && favoriteIds.length > (page + 1) * 20 && (
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
