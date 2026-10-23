import { useDockSpace } from '@/components/use-dock-space';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ScreenSurface } from '@/components/screen-surface';

import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { SearchHeader } from '@/components/search-header';
import { TruckCard } from '@/components/truck-card';
import type { Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { layout, useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';
import { OwnerHome } from '@/features/merchant/owner-home';

function TruckSection({ title, trucks }: { title: string; trucks: Truck[] }) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const cardWidth = Math.min(250, fontScale > 1.3 ? width * 0.7 : (width - 58) / 2);
  if (trucks.length === 0) return null;
  return (
    <View style={{ gap: 18 }}>
      <View style={{ paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text
          accessibilityRole="header"
          style={{
            flex: 1,
            fontSize: 23,
            letterSpacing: -0.5,
            fontWeight: '700',
            color: theme.text,
          }}
        >
          {title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ${title.toLowerCase()} en mapa y lista`}
          onPress={() => router.push('/map')}
          style={{
            minWidth: 48,
            minHeight: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.selected,
          }}
        >
          <Icon name="arrow-forward" color={theme.text} size={22} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: layout.cardGap, paddingHorizontal: layout.edge }}
        keyboardShouldPersistTaps="handled"
      >
        {trucks.map((truck) => (
          <TruckCard key={truck.id} truck={truck} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const { profile } = useAccount();
  return profile?.mode === 'owner' ? <OwnerHome key={profile.id} /> : <ExploreScreen />;
}
function ExploreScreen() {
  const theme = useTheme();
  const bottomSpace = useDockSpace();
  const {
    results,
    filters,
    clearFilters,
    loading,
    error,
    retry,
    favoriteError,
    nextCursor,
    loadMore,
    loadingMore,
  } = useDiscovery();
  const filtered =
    filters.query ||
    filters.category !== 'Todo' ||
    filters.openOnly ||
    filters.maxPriceCents !== null ||
    filters.minPriceCents != null ||
    filters.locality ||
    filters.province ||
    filters.minRating;
  return (
    <ScreenSurface bottom={false} enter>
      <SearchHeader />
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: bottomSpace, gap: 32 }}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        {loading ? (
          <ActivityIndicator accessibilityLabel="Cargando foodtrucks" color={theme.accent} />
        ) : error ? (
          <EmptyState
            icon="cloud-off"
            title="No pudimos cargar los foodtrucks"
            description={error}
            action="Reintentar"
            onPress={retry}
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="search-off"
            title="No encontramos ese sabor"
            description="Prueba otra comida, busca por zona o cambia los filtros."
            action="Ver todos"
            onPress={clearFilters}
          />
        ) : filtered ? (
          <TruckSection
            title={`${results.length} ${results.length === 1 ? 'foodtruck' : 'foodtrucks'} para ti`}
            trucks={results}
          />
        ) : (
          <>
            <TruckSection
              title="Una parada con mucho sabor"
              trucks={results.filter((truck) => truck.open)}
            />
            <TruckSection
              title="Más para descubrir"
              trucks={results.filter((truck) => !truck.open)}
            />
            <View
              style={{
                marginHorizontal: 24,
                padding: 24,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.surface,
                gap: 8,
              }}
            >
              <Icon name="shopping-bag" color={theme.accent} size={28} />
              <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
                Tu comida, a pie de calle.
              </Text>
              <Text style={{ fontSize: 15, lineHeight: 23, color: theme.secondaryText }}>
                Descubre la carta y encuentra tu próxima parada. La recogida es siempre en el
                puesto.
              </Text>
            </View>
          </>
        )}
        {favoriteError !== '' && (
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: theme.text, paddingHorizontal: 24 }}
          >
            {favoriteError}
          </Text>
        )}
        {nextCursor && (
          <Pressable
            accessibilityRole="button"
            disabled={loadingMore}
            onPress={() => void loadMore()}
            style={{ padding: 20, alignItems: 'center' }}
          >
            <Text style={{ color: theme.accent }}>
              {loadingMore ? 'Cargando…' : 'Cargar más foodtrucks'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </ScreenSurface>
  );
}
