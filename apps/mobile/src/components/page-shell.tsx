import { router, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Icon } from './icon';
import { ScreenSurface } from './screen-surface';
import { useTheme } from '@/theme';

export function PageShell({
  title,
  children,
  showBack = true,
  bottomInset = 0,
  action,
}: {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  bottomInset?: number;
  action?: ReactNode;
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const sheet = pathname === '/auth' || pathname === '/account';
  const offset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    offset.set(event.contentOffset.y);
  });
  const compact = useAnimatedStyle(() => ({
    opacity: interpolate(offset.get(), [24, 72], [0, 1], 'clamp'),
  }));
  return (
    <ScreenSurface bottom={!bottomInset} enter={!showBack}>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          paddingHorizontal: 16,
          minHeight: 56,
        }}
      >
        {showBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={sheet ? 'Cerrar' : 'Volver'}
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
            <Icon name={sheet ? 'close' : 'arrow-back'} color={theme.text} />
          </Pressable>
        )}
        <Animated.View
          style={[{ flex: 1 }, compact]}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <Text numberOfLines={1} style={{ color: theme.text, fontSize: 17, fontWeight: '600' }}>
            {title}
          </Text>
        </Animated.View>
        {action}
      </View>
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            padding: 24,
            paddingTop: 8,
            paddingBottom: Math.max(48, bottomInset),
            gap: 28,
            maxWidth: 680,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <Text
            accessibilityRole="header"
            style={{ fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: theme.text }}
          >
            {title}
          </Text>
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </ScreenSurface>
  );
}
