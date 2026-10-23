import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActionButton } from '@/components/action-button';
import { PageShell } from '@/components/page-shell';
import { useAccount } from '@/features/account/account-context';
import { DraftWizard } from '@/features/merchant/draft-wizard';
import type { OwnerTruck } from '@/features/merchant/draft';
import { api } from '@/lib/api';
import { useTheme } from '@/theme';

export default function OwnerTruckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading } = useAccount();
  const theme = useTheme();
  const [started, setStarted] = useState(false);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ key: string; document: OwnerTruck | null; error: string }>({
    key: '',
    document: null,
    error: '',
  });
  const key = `${profile?.id}:${id}:${revision}`;
  const userId = profile?.id;
  useEffect(() => {
    if (!userId || id === 'new') return;
    const controller = new AbortController();
    void api<OwnerTruck>('/merchant/foodtrucks/' + encodeURIComponent(id), {
      signal: controller.signal,
    })
      .then((document) => {
        if (!controller.signal.aborted) setState({ key, document, error: '' });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({
            key,
            document: null,
            error:
              'No se puede abrir este anuncio. Comprueba la conexión y que pertenece a tu cuenta.',
          });
      });
    return () => controller.abort();
  }, [id, userId, key]);
  if (
    !loading &&
    profile?.emailVerified &&
    ((id === 'new' && started) || (state.key === key && state.document))
  ) {
    return (
      <DraftWizard key={`${profile.id}:${id}`} initial={id === 'new' ? null : state.document} />
    );
  }
  return (
    <PageShell title={id === 'new' ? 'Tu próximo foodtruck empieza aquí' : 'Tu anuncio'}>
      {loading ? (
        <ActivityIndicator color={theme.accent} />
      ) : !profile ? (
        <ActionButton label="Iniciar sesión" onPress={() => router.replace('/auth')} />
      ) : !profile.emailVerified ? (
        <>
          <Text style={{ color: theme.text }}>Verifica tu correo para gestionar anuncios.</Text>
          <ActionButton label="Ir a mi cuenta" onPress={() => router.push('/account')} />
        </>
      ) : id === 'new' ? (
        <View style={{ gap: 24 }}>
          <Image
            source={require('../../../assets/foodtrucks/orange-truck.png')}
            contentFit="cover"
            style={{ width: '100%', aspectRatio: 1.05, borderRadius: 22 }}
            accessibilityLabel="Foodtruck ilustrativo de Foodtrucks"
          />
          <Text style={{ color: theme.secondaryText, fontSize: 17, lineHeight: 26 }}>
            Sitúa tu puesto, presenta tu comida y prepara tu anuncio en seis pasos. Podrás guardarlo
            y continuar después de confirmar la ubicación.
          </Text>
          <ActionButton label="Empezar" onPress={() => setStarted(true)} />
          <ActionButton
            label="Ver mis foodtrucks y borradores"
            variant="text"
            onPress={() => router.replace('/')}
          />
        </View>
      ) : state.key === key && state.error ? (
        <>
          <Text style={{ color: theme.text }}>{state.error}</Text>
          <ActionButton label="Reintentar" onPress={() => setRevision((value) => value + 1)} />
        </>
      ) : (
        <ActivityIndicator color={theme.accent} />
      )}
    </PageShell>
  );
}
