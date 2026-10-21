import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/empty-state';
import { useTheme } from '@/theme';

export default function OrdersScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 30, fontWeight: '700', marginTop: 24 }}
        >
          Tus pedidos
        </Text>
        <EmptyState
          icon="receipt-long"
          title="Cada pedido empieza con una buena elección"
          description="Esta demostración permite explorar cartas. Todavía no admite compras ni genera tickets de recogida."
          action="Descubrir foodtrucks"
          onPress={() => router.navigate('/')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
