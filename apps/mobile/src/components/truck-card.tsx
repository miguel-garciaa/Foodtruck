import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { formatPrice, startingPrice, type Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';
import { Icon } from './icon';

export const truckImages = {
  orange: require('../../assets/foodtrucks/orange-truck.png'),
  teal: require('../../assets/foodtrucks/teal-truck.png'),
};

export function TruckCard({ truck, width }: { truck: Truck; width?: number }) {
  const theme = useTheme();
  const { favoriteIds, toggleSaved } = useDiscovery();
  const saved = favoriteIds.includes(truck.id);

  return (
    <View style={{ width, gap: 10 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ${truck.name}, ${truck.category}, ${truck.open ? 'abierto' : 'cerrado'}`}
        onPress={() => router.push({ pathname: '/foodtruck/[id]', params: { id: truck.id } })}
        style={({ pressed }) => ({ gap: 10, opacity: pressed ? 0.8 : 1 })}
      >
        <Image
          source={truckImages[truck.image]}
          contentFit="cover"
          style={{ width: '100%', aspectRatio: 1.08, borderRadius: 24 }}
          accessibilityLabel={`Fotografía ilustrativa de ${truck.name}`}
        />
        <View style={{ gap: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{truck.name}</Text>
          <Text style={{ fontSize: 14, color: theme.secondaryText }}>
            {truck.category} · {truck.area}
          </Text>
          <Text style={{ fontSize: 14, color: theme.text }}>
            Desde <Text style={{ fontWeight: '700' }}>{formatPrice(startingPrice(truck))}</Text>
          </Text>
        </View>
      </Pressable>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 12, left: 12, right: 52, alignItems: 'flex-start' }}
      >
        <View
          style={{
            backgroundColor: theme.surface,
            paddingHorizontal: 10,
            paddingVertical: 7,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: theme.text }}>
            {truck.open ? 'Abierto · demo' : 'Cerrado · demo'}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => toggleSaved(truck.id)}
        accessibilityRole="button"
        accessibilityLabel={`${saved ? 'Quitar' : 'Guardar'} ${truck.name} ${saved ? 'de' : 'en'} favoritos`}
        accessibilityState={{ selected: saved }}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: theme.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name={saved ? 'favorite' : 'favorite-border'}
          color={saved ? theme.accent : theme.text}
        />
      </Pressable>
    </View>
  );
}
