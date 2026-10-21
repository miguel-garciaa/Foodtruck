import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

export function Icon({
  name,
  color,
  size = 24,
}: {
  name: IconName;
  color: ComponentProps<typeof MaterialIcons>['color'];
  size?: number;
}) {
  return <MaterialIcons name={name} color={color} size={size} accessible={false} />;
}
