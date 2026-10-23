import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { ScreenSurface } from '@/components/screen-surface';
import { DiscoveryMap } from '@/components/discovery-map';
import { EmptyState } from '@/components/empty-state';
import { SearchHeader } from '@/components/search-header';
import { TruckCard } from '@/components/truck-card';
import type { Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';
import { useDockSpace } from '@/components/use-dock-space';

export default function MapScreen() {
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const bottomSpace = useDockSpace();
  const {
    results,
    clearFilters,
    setBounds,
    loading,
    error,
    retry,
    nextCursor,
    loadMore,
    loadingMore,
    mapFocus,
  } = useDiscovery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sheet = useRef<BottomSheet>(null);
  const ordered = [...results].sort(
    (a, b) => Number(b.id === selectedId) - Number(a.id === selectedId),
  );
  function select(id: string) {
    setSelectedId(id);
    sheet.current?.snapToIndex(1);
  }
  return (
    <ScreenSurface bottom={false} enter>
      <SearchHeader />
      <View style={{ flex: 1 }}>
        <DiscoveryMap
          trucks={results}
          selectedId={selectedId}
          onSelect={select}
          onBoundsChange={setBounds}
          focus={mapFocus}
        />
        <BottomSheet
          ref={sheet}
          index={fontScale > 1.3 ? 1 : 0}
          snapPoints={['24%', '52%', '88%']}
          enableDynamicSizing={false}
          enablePanDownToClose={false}
          bottomInset={bottomSpace - 12}
          backgroundStyle={{ backgroundColor: theme.surface }}
          handleIndicatorStyle={{ backgroundColor: theme.border }}
        >
          <BottomSheetFlatList<Truck>
            data={ordered}
            keyExtractor={(truck) => truck.id}
            contentContainerStyle={{ padding: 24, gap: 20 }}
            renderItem={({ item }) => <TruckCard truck={item} />}
            ListHeaderComponent={
              <View style={{ gap: 12 }}>
                <Text
                  accessibilityRole="header"
                  style={{ fontSize: 23, fontWeight: '700', color: theme.text }}
                >
                  {loading
                    ? 'Buscando en esta zona…'
                    : `${results.length} foodtrucks${nextCursor ? ' y más' : ''}`}
                </Text>
                <Text style={{ fontSize: 14, color: theme.secondaryText }}>
                  Mueve el mapa para buscar. Desliza el panel para ver los anuncios publicados.
                </Text>
              </View>
            }
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator color={theme.accent} accessibilityLabel="Cargando foodtrucks" />
              ) : error ? (
                <EmptyState
                  icon="cloud-off"
                  title="No pudimos cargar la zona"
                  description={error}
                  action="Reintentar"
                  onPress={retry}
                />
              ) : (
                <EmptyState
                  icon="search-off"
                  title="Sin anuncios publicados en esta zona"
                  description="Amplía el mapa o restablece tus filtros."
                  action="Restablecer filtros"
                  onPress={clearFilters}
                />
              )
            }
            ListFooterComponent={
              nextCursor ? (
                <Pressable
                  disabled={loadingMore}
                  accessibilityRole="button"
                  onPress={() => void loadMore()}
                  style={{ minHeight: 48, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: theme.accent, fontSize: 16 }}>
                    {loadingMore ? 'Cargando…' : 'Cargar más resultados'}
                  </Text>
                </Pressable>
              ) : undefined
            }
          />
        </BottomSheet>
      </View>
    </ScreenSurface>
  );
}
