import { Button as NativeButton, Text } from '@expo/ui';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '@/theme';

export type FormButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'text';
};
export function FormButton({ label, variant = 'filled', ...props }: FormButtonProps) {
  const { width, fontScale } = useWindowDimensions();
  const theme = useTheme();
  return (
    <NativeButton
      {...props}
      variant={variant}
      style={{
        width: Math.min(width - 48, 630),
        height: Math.max(52, 28 * fontScale + 24),
        borderRadius: 16,
      }}
    >
      <Text
        textStyle={{
          fontSize: 16,
          fontWeight: '600',
          color: variant === 'filled' ? theme.onAccent : theme.text,
        }}
      >
        {label}
      </Text>
    </NativeButton>
  );
}
