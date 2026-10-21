import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { SearchHeader } from '@/components/search-header';
import { TruckCard } from '@/components/truck-card';
import type { Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

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
            minWidth: 44,
            minHeight: 44,
            borderRadius: 22,
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
        contentContainerStyle={{ gap: 14, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {trucks.map((truck) => (
          <TruckCard key={truck.id} truck={truck} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function ExploreScreen() {
  const theme = useTheme();
  const { results, filters, clearFilters } = useDiscovery();
  const filtered =
    filters.query ||
    filters.category !== 'Todo' ||
    filters.openOnly ||
    filters.maxPriceCents !== null;
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <SearchHeader />
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 130, gap: 32 }}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        {results.length === 0 ? (
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
      </ScrollView>
    </SafeAreaView>
  );
}
