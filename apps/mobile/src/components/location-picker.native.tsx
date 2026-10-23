import Mapbox from '@rnmapbox/maps';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import type { LocationPickerProps } from './location-picker';
import { ActionButton } from './action-button';
import { Icon } from './icon';
import { validPoint } from '@/features/merchant/draft';
import { useTheme } from '@/theme';
import { ManualCoordinates } from './manual-coordinates';

const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (token?.startsWith('pk.')) Mapbox.setAccessToken(token);
export function LocationPicker({ longitude, latitude, onChange, disabled }: LocationPickerProps) {
  const [failed, setFailed] = useState(false);
  const theme = useTheme();
  const dark = useColorScheme() === 'dark';
  const reduced = useReducedMotion();
  const camera = useRef<ComponentRef<typeof Mapbox.Camera>>(null);
  const [initialCamera] = useState(() => ({
    centerCoordinate: validPoint(longitude, latitude) ? [longitude, latitude] : [-3.7, 40.4],
    zoomLevel: validPoint(longitude, latitude) ? 15 : 5,
  }));
  const center = useRef<[number, number]>([
    initialCamera.centerCoordinate[0],
    initialCamera.centerCoordinate[1],
  ]);
  useEffect(() => {
    if (validPoint(longitude, latitude))
      camera.current?.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 15,
        animationDuration: reduced ? 0 : 300,
      });
  }, [longitude, latitude, reduced]);
  if (!token?.startsWith('pk.') || failed)
    return (
      <ManualCoordinates
        longitude={longitude}
        latitude={latitude}
        onChange={onChange}
        disabled={disabled}
      />
    );
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: theme.secondaryText, fontSize: 15 }}>
        Mueve el mapa hasta el punto de recogida y confirma el marcador.
      </Text>
      <View
        style={{
          height: 280,
          borderRadius: 22,
          overflow: 'hidden',
          backgroundColor: theme.selected,
        }}
      >
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL={dark ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Light}
          scrollEnabled={!disabled}
          zoomEnabled={!disabled}
          scaleBarEnabled={false}
          attributionEnabled
          logoEnabled
          onMapLoadingError={() => setFailed(true)}
          onMapIdle={({ properties }) => {
            center.current = [properties.center[0], properties.center[1]];
          }}
        >
          <Mapbox.Camera ref={camera} defaultSettings={initialCamera} />
        </Mapbox.MapView>
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -36 }}
        >
          <Icon name="location-on" size={36} color={theme.accent} />
        </View>
      </View>
      <ActionButton
        variant="outlined"
        label="Confirmar punto del mapa"
        disabled={disabled}
        onPress={() => onChange(...center.current)}
      />
      {validPoint(longitude, latitude) && (
        <Text accessibilityLiveRegion="polite" style={{ color: theme.secondaryText }}>
          Punto seleccionado: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </Text>
      )}
    </View>
  );
}
