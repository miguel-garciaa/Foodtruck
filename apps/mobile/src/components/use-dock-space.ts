import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dockHeight } from '@/theme';

export function useDockSpace() {
  const { fontScale } = useWindowDimensions();
  return dockHeight(fontScale) + useSafeAreaInsets().bottom + 26;
}
