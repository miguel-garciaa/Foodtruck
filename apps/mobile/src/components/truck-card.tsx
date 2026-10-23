import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { formatPrice, startingPrice, type Truck } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { layout, useTheme } from '@/theme';
import { Icon } from './icon';

export const truckImages = {
  orange: require('../../assets/foodtrucks/orange-truck.png'),
  teal: require('../../assets/foodtrucks/teal-truck.png'),
};
export function truckImageSource(truck: Truck) {
  return truck.photoUrls?.[0]
    ? { uri: truck.photoUrls[0] }
    : truck.image
      ? truckImages[truck.image]
      : undefined;
}

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
          source={truckImageSource(truck)}
          contentFit="cover"
          style={{ width: '100%', aspectRatio: 1.05, borderRadius: layout.cardRadius }}
          accessibilityLabel={`Fotografía de ${truck.name}`}
        />
        <View style={{ gap: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{truck.name}</Text>
          <Text style={{ fontSize: 14, color: theme.secondaryText }}>
            {truck.category} · {truck.area}
          </Text>
          <Text style={{ fontSize: 14, color: theme.text }}>
            {truck.startingPriceCents == null ? (
              'Consulta la carta'
            ) : (
              <>
                Desde <Text style={{ fontWeight: '700' }}>{formatPrice(startingPrice(truck))}</Text>
              </>
            )}
          </Text>
          <Text style={{ fontSize: 14, color: theme.secondaryText }}>
            {truck.rating == null
              ? 'Sin valoraciones'
              : `${truck.rating.toLocaleString('es-ES')} · ${truck.ratingCount} valoraciones`}
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
            {truck.open ? 'Abierto' : 'Cerrado'}
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
          right: 0,
          top: 0,
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ position: 'absolute' }}>
            <Icon size={20} name="favorite" color={saved ? theme.accent : 'rgba(0,0,0,0.45)'} />
          </View>
          <Icon size={20} name="favorite-border" color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}
