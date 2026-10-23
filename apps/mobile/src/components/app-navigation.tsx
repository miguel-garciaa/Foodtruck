import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from './icon';
import { dockHeight, useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';
import { ActivityIndicator, Pressable, View, useWindowDimensions } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

export function AppNavigation() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const reduced = useReducedMotion();
  const { profile, loading } = useAccount();
  const owner = profile?.mode === 'owner';
  const destinations: { name: string; title: string; icon: IconName }[] = [
    {
      name: 'index',
      title: owner ? 'Mis foodtrucks' : 'Explorar',
      icon: owner ? 'storefront' : 'search',
    },
    { name: 'map', title: 'Mapa', icon: 'map' },
    { name: 'orders', title: 'Pedidos', icon: 'receipt-long' },
    { name: 'profile', title: owner ? 'Menú' : 'Perfil', icon: owner ? 'menu' : 'person-outline' },
  ];
  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.accent} accessibilityLabel="Recuperando tu cuenta" />
      </View>
    );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        transitionSpec: { animation: 'timing', config: { duration: reduced ? 100 : 180 } },
        sceneStyle: { backgroundColor: theme.background },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarAllowFontScaling: true,
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: '600' },
        tabBarButton: ({
          style,
          children,
          onPress,
          onLongPress,
          testID,
          'aria-label': label,
          'aria-selected': selected,
        }) => (
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            testID={testID}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: selected === true }}
            style={({ pressed }) => [
              style,
              {
                minHeight: 48,
                padding: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: pressed ? theme.selected : 'transparent',
              },
            ]}
          >
            {children}
          </Pressable>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 10,
          marginHorizontal: 20,
          height: dockHeight(fontScale),
          paddingTop: 2,
          paddingBottom: 2,
          borderRadius: 26,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
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
