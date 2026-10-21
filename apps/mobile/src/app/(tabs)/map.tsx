import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscoveryMap } from '@/components/discovery-map';
import { EmptyState } from '@/components/empty-state';
import { SearchHeader } from '@/components/search-header';
import { TruckCard } from '@/components/truck-card';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

export default function MapScreen() {
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const { results, clearFilters } = useDiscovery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ordered = [...results].sort(
    (a, b) => Number(b.id === selectedId) - Number(a.id === selectedId),
  );
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <SearchHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ height: Math.max(320, 320 * fontScale), backgroundColor: theme.selected }}>
          <DiscoveryMap trucks={results} selectedId={selectedId} onSelect={setSelectedId} />
        </View>
        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -20,
            padding: 24,
            gap: 22,
          }}
        >
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.border,
              alignSelf: 'center',
            }}
          />
          <Text
            accessibilityRole="header"
            style={{ fontSize: 23, fontWeight: '700', color: theme.text }}
          >
            {results.length} foodtrucks para descubrir
          </Text>
          <Text style={{ fontSize: 14, color: theme.secondaryText }}>
            Zona de ejemplo · Resultados de demostración
          </Text>
          {ordered.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
          {results.length === 0 && (
            <EmptyState
              icon="search-off"
              title="Sin resultados"
              description="Amplía la búsqueda o restablece tus filtros."
              action="Restablecer filtros"
              onPress={clearFilters}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
