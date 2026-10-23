import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from './icon';
import { useTheme } from '@/theme';

export function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const content = (
    <>
      <Icon name={icon} color={theme.text} size={24} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ color: theme.text, fontSize: 15, lineHeight: 22 }}>{title}</Text>
        {subtitle && (
          <Text style={{ color: theme.secondaryText, fontSize: 13, lineHeight: 19 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {onPress && <Icon name="chevron-right" color={theme.secondaryText} size={24} />}
    </>
  );
  const style = {
    minHeight: 68,
    paddingVertical: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
  };
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        style,
        { backgroundColor: pressed ? theme.selected : 'transparent' },
      ]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
