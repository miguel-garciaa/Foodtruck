import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setToolsButtonVisible } from 'expo-dev-client';

import { themes } from '@/theme';
import { DiscoveryProvider } from '@/features/discovery/discovery-context';
import { AccountProvider } from '@/features/account/account-context';
import { PushLifecycle } from '@/features/account/push-lifecycle';

// Expo's floating tools button covers the filter action on a phone-sized viewport.
if (__DEV__) setToolsButtonVisible(false);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AccountProvider>
        <PushLifecycle />
        <DiscoveryProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="foodtruck/[id]" />
            <Stack.Screen name="favorites" />
          </Stack>
        </DiscoveryProvider>
      </AccountProvider>
    </GestureHandlerRootView>
  );
}
