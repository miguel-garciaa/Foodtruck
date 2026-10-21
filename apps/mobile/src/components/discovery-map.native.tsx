import Mapbox from '@rnmapbox/maps';
import { useRef, useState, type ComponentRef } from 'react';
import { useColorScheme } from 'react-native';
import { EmptyState } from './empty-state';
import type { DiscoveryMapProps } from './discovery-map';
import { useTheme } from '@/theme';

const publicToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
const hasPublicToken = Boolean(publicToken?.startsWith('pk.'));
if (hasPublicToken) Mapbox.setAccessToken(publicToken!);

export function DiscoveryMap({ trucks, selectedId, onSelect }: DiscoveryMapProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [failed, setFailed] = useState(false);
  const camera = useRef<ComponentRef<typeof Mapbox.Camera>>(null);
  const source = useRef<ComponentRef<typeof Mapbox.ShapeSource>>(null);
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
    >
      <Mapbox.Camera
        ref={camera}
        defaultSettings={{ centerCoordinate: [-0.375, 39.469], zoomLevel: 12.6 }}
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
                  animationDuration: 0,
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
