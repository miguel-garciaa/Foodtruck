import { Button, OutlinedButton, TextButton, Text, Shape } from '@expo/ui/jetpack-compose';
import { height, width } from '@expo/ui/jetpack-compose/modifiers';
import { useWindowDimensions } from 'react-native';
import type { FormButtonProps } from './form-button';
import { useTheme } from '@/theme';

export function FormButton({ label, onPress, disabled, variant = 'filled' }: FormButtonProps) {
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const Component =
    variant === 'outlined' ? OutlinedButton : variant === 'text' ? TextButton : Button;
  return (
    <Component
      onClick={onPress}
      enabled={!disabled}
      colors={{
        containerColor: variant === 'filled' ? theme.accent : 'transparent',
        contentColor: variant === 'filled' ? theme.onAccent : theme.text,
      }}
      shape={Shape.RoundedCorner({
        cornerRadii: { topStart: 16, topEnd: 16, bottomStart: 16, bottomEnd: 16 },
      })}
      modifiers={[
        width(Math.min(dimensions.width - 48, 630)),
        height(Math.max(52, 28 * dimensions.fontScale + 24)),
      ]}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </Component>
  );
}
