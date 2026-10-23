import { Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme';

export type LocationPickerProps = {
  longitude: number;
  latitude: number;
  onChange: (longitude: number, latitude: number) => void;
  disabled?: boolean;
};

export function ManualCoordinates({
  longitude,
  latitude,
  onChange,
  disabled,
}: LocationPickerProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: theme.secondaryText, fontSize: 15 }}>
        Introduce las coordenadas del punto de recogida si no puedes utilizar el mapa.
      </Text>
      <Text style={{ color: theme.text }}>Longitud</Text>
      <TextInput
        accessibilityLabel="Longitud del puesto"
        keyboardType="numbers-and-punctuation"
        editable={!disabled}
        defaultValue={longitude === 0 ? '' : String(longitude)}
        onChangeText={(value) =>
          onChange(value.trim() ? Number(value.replace(',', '.')) : NaN, latitude)
        }
        style={{
          color: theme.text,
          minHeight: 52,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 12,
          padding: 12,
        }}
      />
      <Text style={{ color: theme.text }}>Latitud</Text>
      <TextInput
        accessibilityLabel="Latitud del puesto"
        keyboardType="numbers-and-punctuation"
        editable={!disabled}
        defaultValue={latitude === 0 ? '' : String(latitude)}
        onChangeText={(value) =>
          onChange(longitude, value.trim() ? Number(value.replace(',', '.')) : NaN)
        }
        style={{
          color: theme.text,
          minHeight: 52,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 12,
          padding: 12,
        }}
      />
    </View>
  );
}
