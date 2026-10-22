import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { truckImageSource } from '@/components/truck-card';
import { formatPrice } from '@/features/discovery/catalog';
import { usePublicTruck } from '@/features/discovery/use-public-truck';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

export default function TruckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { favoriteIds, toggleSaved } = useDiscovery();
  const { truck, loading, error, retry } = usePublicTruck(id);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  if (!truck)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <EmptyState
          icon="storefront"
          title={loading ? 'Cargando foodtruck…' : 'No encontramos este foodtruck'}
          description={error || 'Consultando la información publicada.'}
          action={loading ? undefined : 'Reintentar'}
          onPress={retry}
        />
      </SafeAreaView>
    );
  const saved = favoriteIds.includes(truck.id);
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          maxWidth: 760,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <View>
          <Image
            source={truckImageSource(truck)}
            contentFit="cover"
            style={{ width: '100%', aspectRatio: 1.15 }}
            accessibilityLabel={`Fotografía de ${truck.name}`}
          />
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 20,
              right: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={goBack}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surface,
              }}
            >
              <Icon name="arrow-back" color={theme.text} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${saved ? 'Quitar de' : 'Guardar en'} favoritos`}
              accessibilityState={{ selected: saved }}
              onPress={() => toggleSaved(truck.id)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={saved ? 'favorite' : 'favorite-border'}
                  color={saved ? theme.accent : theme.text}
                  size={20}
                />
              </View>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            padding: 24,
            paddingTop: 32,
            gap: 20,
            marginTop: -20,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: theme.background,
          }}
        >
          <Text style={{ fontSize: 12, color: theme.accent, fontWeight: '700' }}>FOODTRUCK</Text>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 30, fontWeight: '700', color: theme.text }}
          >
            {truck.name}
          </Text>
          <Text style={{ fontSize: 16, color: theme.secondaryText }}>
            {truck.category} · {truck.open ? 'Abierto' : 'Cerrado'}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 25, color: theme.text }}>
            {truck.description}
          </Text>
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: theme.border,
              gap: 8,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: '600', fontSize: 17 }}>
              Recogida en el puesto
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 15, lineHeight: 23 }}>
              {truck.address}
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 13 }}>
              Información publicada por el propietario y revisada antes de su publicación.
            </Text>
          </View>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 25, fontWeight: '700', color: theme.text }}
          >
            La carta
          </Text>
          {truck.menu.map((item) => (
            <View
              key={item.id}
              style={{ gap: 8, paddingBottom: 22, borderBottomWidth: 1, borderColor: theme.border }}
            >
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: theme.text }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text }}>
                  {formatPrice(item.priceCents)}
                </Text>
              </View>
              <Text style={{ color: theme.secondaryText, fontSize: 15, lineHeight: 23 }}>
                {item.description}
              </Text>
              <Text style={{ color: theme.secondaryText, fontSize: 13, lineHeight: 21 }}>
                Alérgenos: {item.allergens || 'Consulta al propietario.'}
              </Text>
            </View>
          ))}
          <Text style={{ color: theme.secondaryText, fontSize: 14, lineHeight: 23 }}>
            Esta versión DEV permite descubrir foodtrucks y consultar su carta. Los pedidos y pagos
            llegarán en otro hito.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
