import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from './icon';
import { useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';
import { useWindowDimensions } from 'react-native';

export function AppNavigation() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const owner = useAccount().profile?.mode === 'owner';
  const destinations: { name: string; title: string; icon: IconName }[] = [
    { name: 'index', title: owner ? 'Mis foodtrucks' : 'Explorar', icon: 'search' },
    { name: 'map', title: 'Mapa', icon: 'map' },
    { name: 'orders', title: 'Pedidos', icon: 'receipt-long' },
    { name: 'profile', title: 'Perfil', icon: 'person-outline' },
  ];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 10,
          marginHorizontal: 20,
          height: 60 + Math.max(0, fontScale - 1) * 16,
          paddingTop: 6,
          paddingBottom: 6,
          borderRadius: 28,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          boxShadow: '0 3px 14px rgba(0,0,0,0.07)',
        },
      }}
    >
      {destinations.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            href: owner && item.name === 'map' ? null : undefined,
            tabBarAccessibilityLabel: item.title,
            tabBarIcon: ({ color }) => (
              <Icon
                name={item.icon}
                color={typeof color === 'string' ? color : theme.text}
                size={23}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
