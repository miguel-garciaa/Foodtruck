import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { themes } from '@/theme';
import { DiscoveryProvider } from '@/features/discovery/discovery-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <DiscoveryProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="foodtruck/[id]" />
        <Stack.Screen name="favorites" />
      </Stack>
    </DiscoveryProvider>
  );
}
