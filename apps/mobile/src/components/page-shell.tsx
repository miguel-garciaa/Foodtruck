import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from './icon';
import { useTheme } from '@/theme';

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          padding: 24,
          paddingTop: 8,
          paddingBottom: 48,
          gap: 12,
          maxWidth: 680,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.selected,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="arrow-back" color={theme.text} />
        </Pressable>
        <View style={{ gap: 28 }}>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: theme.text }}
          >
            {title}
          </Text>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
