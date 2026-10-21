import { Link, Slot, usePathname } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

// El navegador es una previsualización: header web; nunca dock nativo en web.
export function AppNavigation() {
  const theme = useTheme();
  const pathname = usePathname();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 16,
          gap: 20,
          borderBottomWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text style={{ fontWeight: '700', color: theme.text }}>Foodtrucks</Text>
        {(
          [
            ['/', 'Explorar'],
            ['/map', 'Mapa'],
            ['/orders', 'Pedidos'],
            ['/profile', 'Perfil'],
          ] as const
        ).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            style={{ color: pathname === href ? theme.accent : theme.secondaryText }}
          >
            {label}
          </Link>
        ))}
      </View>
      <Slot />
    </View>
  );
}
