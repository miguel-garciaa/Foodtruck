import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';
import { layout, motion, useTheme } from '@/theme';

export function ActionButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'filled',
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'neutral' | 'outlined' | 'text';
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const blocked = disabled || loading;
  const color =
    variant === 'filled' ? theme.onAccent : variant === 'neutral' ? theme.onNeutral : theme.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(blocked), busy: Boolean(loading) }}
      disabled={blocked}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      pressRetentionOffset={16}
      style={style}
    >
      <Animated.View
        style={{
          minHeight: 52,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: layout.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 10,
          backgroundColor:
            variant === 'filled'
              ? theme.accent
              : variant === 'neutral'
                ? theme.neutral
                : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: theme.border,
          opacity: blocked ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !reduced ? 0.98 : 1 }],
          transitionProperty: ['transform', 'opacity'],
          transitionDuration: reduced ? 0 : motion.press,
          transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
        }}
      >
        {loading && <ActivityIndicator color={color} />}
        <Text
          style={{ color, fontSize: 16, fontWeight: '600', textAlign: 'center', flexShrink: 1 }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
