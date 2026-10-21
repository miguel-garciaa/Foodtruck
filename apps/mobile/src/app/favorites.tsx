import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { TruckCard, truckImages } from '@/components/truck-card';
import { demoTrucks } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { favoriteIds } = useDiscovery();
  const saved = demoTrucks.filter((truck) => favoriteIds.includes(truck.id));
  const [expanded, setExpanded] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          maxWidth: 640,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a explorar"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={{ minWidth: 48, minHeight: 48, justifyContent: 'center' }}
          >
            <Icon name="arrow-back" color={theme.text} />
          </Pressable>
          <Text
            accessibilityRole="header"
            style={{ flex: 1, fontSize: 28, fontWeight: '700', color: theme.text }}
          >
            Favoritos
          </Text>
        </View>
        <Text style={{ color: theme.secondaryText, fontSize: 14 }}>
          Guardados durante esta sesión de demostración.
        </Text>
        {saved.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${expanded ? 'Ocultar' : 'Ver'} ${saved.length} paradas guardadas`}
            accessibilityState={{ expanded }}
            onPress={() => setExpanded(!expanded)}
            style={{ gap: 12, alignItems: 'flex-start' }}
          >
            <View
              style={{
                width: 190,
                height: 180,
                borderRadius: 24,
                overflow: 'hidden',
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: theme.selected,
              }}
            >
              {saved.slice(0, 4).map((truck) => (
                <Image
                  key={truck.id}
                  source={truckImages[truck.image]}
                  contentFit="cover"
                  style={{
                    width: saved.length === 1 ? '100%' : '50%',
                    height: saved.length < 3 ? '100%' : '50%',
                    borderWidth: 1,
                    borderColor: theme.background,
                  }}
                />
              ))}
            </View>
            <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
              Tus próximas paradas
            </Text>
            <Text style={{ fontSize: 15, color: theme.secondaryText }}>
              {saved.length === 1 ? '1 foodtruck guardado' : `${saved.length} foodtrucks guardados`}{' '}
              · {expanded ? 'Ocultar lista' : 'Ver lista'}
            </Text>
          </Pressable>
        )}
        {expanded && saved.map((truck) => <TruckCard key={truck.id} truck={truck} />)}
        {saved.length === 0 && (
          <EmptyState
            icon="favorite-border"
            title="Guarda tu próxima parada"
            description="Toca el corazón de un foodtruck y lo encontrarás aquí."
            action="Explorar foodtrucks"
            onPress={() => router.navigate('/')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
