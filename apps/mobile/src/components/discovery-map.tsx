import { EmptyState } from './empty-state';
import type { Truck } from '@/features/discovery/catalog';
import type { Bounds } from '@/features/discovery/remote';

export type DiscoveryMapProps = {
  trucks: Truck[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBoundsChange: (bounds: Bounds) => void;
};

export function DiscoveryMap(_props: DiscoveryMapProps) {
  return (
    <EmptyState
      icon="map"
      title="Sigue explorando en la lista"
      description="La vista del mapa se prepara en la aplicación Android. Puedes consultar todos los puestos aquí abajo."
    />
  );
}
