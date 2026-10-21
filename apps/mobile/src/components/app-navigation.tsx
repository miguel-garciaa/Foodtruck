import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from './icon';
import { useTheme } from '@/theme';

export function AppNavigation() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const destinations: { name: string; title: string; icon: IconName }[] = [
    { name: 'index', title: 'Explorar', icon: 'search' },
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
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 28,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          boxShadow: '0 6px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      {destinations.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarAccessibilityLabel: item.title,
            tabBarIcon: ({ color }) => (
              <Icon
                name={item.icon}
                color={typeof color === 'string' ? color : theme.text}
                size={25}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
