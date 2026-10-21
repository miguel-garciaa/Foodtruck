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
      <Icon name={icon} color={theme.text} size={26} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ color: theme.text, fontSize: 17 }}>{title}</Text>
        {subtitle && (
          <Text style={{ color: theme.secondaryText, fontSize: 14, lineHeight: 21 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {onPress && <Icon name="chevron-right" color={theme.secondaryText} size={24} />}
    </>
  );
  const style = {
    minHeight: 76,
    paddingVertical: 18,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 18,
  };
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={style}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
