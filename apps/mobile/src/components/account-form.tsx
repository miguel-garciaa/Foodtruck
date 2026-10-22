import { Column, Host, Text, TextInput, useNativeState, type TextInputProps } from '@expo/ui';
import type { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '@/theme';

export function AccountForm({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  return (
    <Host matchContents seedColor={theme.accent}>
      <Column spacing={18} style={{ width: Math.min(width - 48, 630) }}>
        {children}
      </Column>
    </Host>
  );
}
export function AccountField({
  label,
  initialValue = '',
  ...props
}: Omit<TextInputProps, 'value'> & { label: string; initialValue?: string }) {
  const value = useNativeState(initialValue);
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <Column spacing={7}>
      <Text textStyle={{ color: theme.text, fontSize: 15 }}>{label}</Text>
      <TextInput
        {...props}
        placeholder={label}
        value={value}
        defaultValue={initialValue}
        textStyle={{ color: theme.text, fontSize: 16 }}
        style={{
          height: Math.max(
            props.multiline ? 130 : 52,
            (props.multiline ? 76 : 28) * fontScale + 24,
          ),
          padding: 12,
          borderRadius: 12,
          borderColor: theme.border,
          borderWidth: 1,
        }}
      />
    </Column>
  );
}
