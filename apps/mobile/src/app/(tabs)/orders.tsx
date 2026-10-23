import { useDockSpace } from '@/components/use-dock-space';
import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { ScreenSurface } from '@/components/screen-surface';
import { EmptyState } from '@/components/empty-state';
import { useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';

export default function OrdersScreen() {
  const theme = useTheme();
  const owner = useAccount().profile?.mode === 'owner';
  const bottomSpace = useDockSpace();
  return (
    <ScreenSurface bottom={false} enter>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: bottomSpace }}>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 30, fontWeight: '700', marginTop: 24 }}
        >
          {owner ? 'Pedidos de tus foodtrucks' : 'Tus pedidos'}
        </Text>
        <EmptyState
          icon="receipt-long"
          title={
            owner ? 'Tu próxima comanda empieza aquí' : 'Cada pedido empieza con una buena elección'
          }
          description={
            owner
              ? 'La recepción y preparación de pedidos todavía no están activadas en DEV. Mientras tanto, puedes preparar tus anuncios, cartas y horarios.'
              : 'Todavía no se admiten compras ni se generan tickets de recogida. Aquí aparecerán tus pedidos cuando estén disponibles.'
          }
          action={owner ? 'Gestionar mis foodtrucks' : 'Descubrir foodtrucks'}
          onPress={() => router.navigate('/')}
        />
      </ScrollView>
    </ScreenSurface>
  );
}
