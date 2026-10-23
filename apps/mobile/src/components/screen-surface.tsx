import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { useTheme } from '@/theme';

// Resolve padding before mounting a screen, avoiding a native safe-area layout jump.
export function ScreenSurface({
  children,
  bottom = true,
  enter = false,
}: {
  children: ReactNode;
  bottom?: boolean;
  enter?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={enter ? FadeIn.duration(reduced ? 100 : 180) : undefined}
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: bottom ? insets.bottom : 0,
      }}
    >
      {children}
    </Animated.View>
  );
}
