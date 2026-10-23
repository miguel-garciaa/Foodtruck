import { ManualCoordinates, type LocationPickerProps } from './manual-coordinates';
export type { LocationPickerProps } from './manual-coordinates';
export function LocationPicker(props: LocationPickerProps) {
  return <ManualCoordinates {...props} />;
}
