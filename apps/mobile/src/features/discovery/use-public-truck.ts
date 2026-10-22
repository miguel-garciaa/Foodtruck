import { useEffect, useState } from 'react';
import type { components } from '@/generated/api';
import { api, ApiError } from '@/lib/api';
import type { Truck } from './catalog';
import { fromApiTruck } from './remote';

export function usePublicTruck(id: string) {
  const [revision, setRevision] = useState(0);
  const key = id + ':' + revision;
  const [state, setState] = useState<{ key: string; truck: Truck | null; error: string }>({
    key: '',
    truck: null,
    error: '',
  });
  useEffect(() => {
    const controller = new AbortController();
    void api<components['schemas']['Truck']>(
      '/foodtrucks/' + encodeURIComponent(id),
      { signal: controller.signal },
      false,
    )
      .then((result) => setState({ key, truck: fromApiTruck(result), error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            key,
            truck: null,
            error:
              error instanceof ApiError && error.status === 404
                ? 'Este foodtruck ya no está disponible.'
                : 'No pudimos cargar este foodtruck. Comprueba la conexión.',
          });
      });
    return () => controller.abort();
  }, [id, key]);
  return {
    truck: state.key === key ? state.truck : null,
    error: state.key === key ? state.error : '',
    loading: state.key !== key,
    retry: () => setRevision((value) => value + 1),
  };
}
