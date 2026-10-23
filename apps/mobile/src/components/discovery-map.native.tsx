import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { useReducedMotion } from 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { EmptyState } from './empty-state';
import type { DiscoveryMapProps } from './discovery-map';
import { useTheme } from '@/theme';

const publicToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
const hasPublicToken = Boolean(publicToken?.startsWith('pk.'));
if (hasPublicToken) Mapbox.setAccessToken(publicToken!);

export function DiscoveryMap({
  trucks,
  selectedId,
  onSelect,
  onBoundsChange,
  focus,
}: DiscoveryMapProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [failed, setFailed] = useState(false);
  const camera = useRef<ComponentRef<typeof Mapbox.Camera>>(null);
  const source = useRef<ComponentRef<typeof Mapbox.ShapeSource>>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!focus) return;
    const [west, south, east, north] = focus.bounds;
    camera.current?.fitBounds(
      [east + 0.005, north + 0.005],
      [west - 0.005, south - 0.005],
      [48, 32, 180, 32],
      reduced ? 0 : 300,
    );
  }, [focus, reduced]);
  if (!hasPublicToken || failed) {
    return (
      <EmptyState
        icon="map"
        title="El mapa no está disponible"
        description="Puedes seguir descubriendo foodtrucks en la lista. No necesitas compartir tu ubicación."
        action={hasPublicToken ? 'Reintentar mapa' : undefined}
        onPress={hasPublicToken ? () => setFailed(false) : undefined}
      />
    );
  }
  return (
    <Mapbox.MapView
      style={{ flex: 1 }}
      styleURL={colorScheme === 'dark' ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Light}
      onMapLoadingError={() => setFailed(true)}
      attributionEnabled
      logoEnabled
      attributionPosition={{ top: 12, right: 12 }}
      logoPosition={{ top: 12, left: 12 }}
      scaleBarEnabled={false}
      onMapIdle={({ properties }) => {
        const { sw, ne } = properties.bounds;
        if ([...sw, ...ne].every(Number.isFinite) && sw[0] < ne[0] && sw[1] < ne[1])
          onBoundsChange([sw[0], sw[1], ne[0], ne[1]]);
      }}
    >
      <Mapbox.Camera
        ref={camera}
        defaultSettings={{
          bounds: {
            sw: [-18.5, 27.5],
            ne: [4.7, 43.9],
            paddingBottom: 170,
            paddingTop: 32,
            paddingLeft: 24,
            paddingRight: 24,
          },
        }}
      />
      <Mapbox.ShapeSource
        ref={source}
        id="trucks"
        cluster
        clusterRadius={36}
        shape={{
          type: 'FeatureCollection',
          features: trucks.map((truck) => ({
            type: 'Feature',
            id: truck.id,
            properties: { id: truck.id, name: truck.name, selected: truck.id === selectedId },
            geometry: { type: 'Point', coordinates: truck.coordinates },
          })),
        }}
        onPress={async (event) => {
          const feature = event.features[0];
          if (feature?.properties?.cluster && feature.geometry.type === 'Point') {
            try {
              const zoom = await source.current?.getClusterExpansionZoom(feature);
              if (typeof zoom === 'number') {
                camera.current?.setCamera({
                  centerCoordinate: feature.geometry.coordinates,
                  zoomLevel: zoom,
                  animationDuration: reduced ? 0 : 300,
                });
              }
            } catch {
              setFailed(true);
            }
            return;
          }
          const id = feature?.properties?.id;
          if (typeof id === 'string' && trucks.some((truck) => truck.id === id)) onSelect(id);
        }}
      >
        <Mapbox.CircleLayer
          id="truck-points"
          filter={['!', ['has', 'point_count']]}
          style={{
            circleRadius: ['case', ['get', 'selected'], 12, 9],
            circleColor: theme.accent,
            circleStrokeWidth: 3,
            circleStrokeColor: theme.surface,
          }}
        />
        <Mapbox.CircleLayer
          id="truck-clusters"
          filter={['has', 'point_count']}
          style={{
            circleRadius: 18,
            circleColor: theme.accent,
            circleStrokeWidth: 3,
            circleStrokeColor: theme.surface,
          }}
        />
        <Mapbox.SymbolLayer
          id="truck-cluster-count"
          filter={['has', 'point_count']}
          style={{
            textField: ['get', 'point_count_abbreviated'],
            textColor: theme.surface,
            textSize: 12,
          }}
        />
      </Mapbox.ShapeSource>
    </Mapbox.MapView>
  );
}
