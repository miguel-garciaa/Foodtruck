import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { Icon, type IconName } from './icon';

export function EmptyState({
  icon,
  title,
  description,
  action,
  onPress,
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ padding: 32, paddingVertical: 56, alignItems: 'center', gap: 16 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.selected,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} color={theme.accent} size={30} />
      </View>
      <Text
        accessibilityRole="header"
        style={{ fontSize: 23, fontWeight: '600', textAlign: 'center', color: theme.text }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          textAlign: 'center',
          color: theme.secondaryText,
          maxWidth: 340,
        }}
      >
        {description}
      </Text>
      {action && onPress && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{
            minHeight: 48,
            justifyContent: 'center',
            paddingHorizontal: 24,
            borderRadius: 24,
            backgroundColor: theme.accent,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.background }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
