import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setToolsButtonVisible } from 'expo-dev-client';
import { useReducedMotion } from 'react-native-reanimated';

import { themes } from '@/theme';
import { DiscoveryProvider } from '@/features/discovery/discovery-context';
import { AccountProvider } from '@/features/account/account-context';
import { PushLifecycle } from '@/features/account/push-lifecycle';

// Expo's floating tools button covers the filter action on a phone-sized viewport.
if (__DEV__) setToolsButtonVisible(false);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const reduced = useReducedMotion();
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
              animation: reduced ? 'fade' : 'slide_from_right',
              animationMatchesGesture: true,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="foodtruck/[id]" />
            <Stack.Screen name="favorites" />
            <Stack.Screen
              name="auth"
              options={{
                presentation: 'formSheet',
                animation: reduced ? 'fade' : 'slide_from_bottom',
                sheetAllowedDetents: [0.92, 1],
                sheetCornerRadius: 28,
                sheetGrabberVisible: true,
                contentStyle: { backgroundColor: theme.surface },
              }}
            />
            <Stack.Screen
              name="account"
              options={{
                presentation: 'formSheet',
                animation: reduced ? 'fade' : 'slide_from_bottom',
                sheetAllowedDetents: [0.92, 1],
                sheetCornerRadius: 28,
                sheetGrabberVisible: true,
                contentStyle: { backgroundColor: theme.surface },
              }}
            />
          </Stack>
        </DiscoveryProvider>
      </AccountProvider>
    </GestureHandlerRootView>
  );
}
