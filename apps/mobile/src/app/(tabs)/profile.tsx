import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/icon';
import { MenuRow } from '@/components/menu-row';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { favoriteIds } = useDiscovery();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 12, paddingBottom: 120, gap: 24 }}
      >
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 30, fontWeight: '700' }}
        >
          Perfil
        </Text>
        <View
          style={{
            padding: 32,
            backgroundColor: theme.surface,
            borderRadius: 28,
            gap: 14,
            alignItems: 'center',
            boxShadow: '0 4px 22px rgba(0,0,0,0.06)',
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: theme.softAccent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="person-outline" color={theme.accent} size={42} />
          </View>
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '600' }}>
            A tu aire, a tu gusto
          </Text>
          <Text
            style={{
              color: theme.secondaryText,
              fontSize: 16,
              lineHeight: 25,
              textAlign: 'center',
            }}
          >
            Descubre nuevos sabores y guarda las paradas a las que quieres volver.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mis favoritos. ${favoriteIds.length} paradas guardadas`}
          onPress={() => router.push('/favorites')}
          style={{
            minHeight: 110,
            padding: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 18,
            borderRadius: 24,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Icon name="favorite-border" color={theme.accent} size={32} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ fontSize: 19, fontWeight: '600', color: theme.text }}>
              Mis favoritos
            </Text>
            <Text style={{ fontSize: 14, color: theme.secondaryText }}>
              {favoriteIds.length === 1
                ? '1 parada guardada'
                : `${favoriteIds.length} paradas guardadas`}
            </Text>
          </View>
          <Icon name="chevron-right" color={theme.secondaryText} />
        </Pressable>
        <View>
          <MenuRow
            icon="receipt-long"
            title="Tus pedidos"
            onPress={() => router.navigate('/orders')}
          />
          <MenuRow icon="tune" title="Preferencias" onPress={() => router.push('/preferences')} />
          <MenuRow icon="help-outline" title="Recibe ayuda" onPress={() => router.push('/help')} />
          <MenuRow
            icon="pan-tool-alt"
            title="Tu privacidad"
            onPress={() => router.push('/privacy')}
          />
        </View>
        <Text style={{ fontSize: 13, lineHeight: 22, color: theme.secondaryText }}>
          Foodtrucks · Versión de demostración{'\n'}Sin cuenta iniciada. Tus favoritos se conservan
          durante esta sesión.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
