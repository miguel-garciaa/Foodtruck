import { useDockSpace } from '@/components/use-dock-space';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { PageShell } from '@/components/page-shell';
import { router, useFocusEffect } from 'expo-router';
import { FormButton as Button } from '@/components/form-button';
import type { components } from '@/generated/api';
import { api } from '@/lib/api';
import { AccountForm } from '@/components/account-form';
import { useAccount } from '@/features/account/account-context';
import { PrivatePhoto } from '@/components/private-photo';
import { Icon } from '@/components/icon';
import { firstIncompleteStep, steps } from './draft';
import { useTheme } from '@/theme';

export const listingStatus = {
  draft: 'Borrador',
  submitted: 'En revisión',
  published: 'Publicado',
  changes_requested: 'Cambios solicitados',
  archived: 'Archivado',
};
export function OwnerHome() {
  const theme = useTheme();
  const bottomSpace = useDockSpace();
  const { profile } = useAccount();
  const [list, setList] = useState<components['schemas']['OwnerTrucks'] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const reload = useCallback(async (signal?: AbortSignal) => {
    try {
      const next = await api<components['schemas']['OwnerTrucks']>('/merchant/foodtrucks', {
        signal,
      });
      if (!signal?.aborted) {
        setList(next);
        setError('');
      }
    } catch {
      if (!signal?.aborted) setError('No pudimos recuperar tus anuncios.');
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      void reload(controller.signal);
      return () => controller.abort();
    }, [reload]),
  );
  async function more() {
    if (!list?.nextCursor || busy) return;
    setBusy(true);
    try {
      const next = await api<components['schemas']['OwnerTrucks']>(
        '/merchant/foodtrucks?cursor=' + list.nextCursor,
      );
      setList({ items: [...list.items, ...next.items], nextCursor: next.nextCursor });
    } catch {
      setError('No pudimos cargar más anuncios.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell
      title="Mis foodtrucks"
      showBack={false}
      bottomInset={bottomSpace}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Crear foodtruck"
          onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: 'new' } })}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.selected,
          }}
        >
          <Icon name="add" color={theme.text} />
        </Pressable>
      }
    >
      <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
        Gestiona tus anuncios. Los cambios se publican después de la revisión.
      </Text>
      <AccountForm>
        <Button
          label={profile?.emailVerified ? 'Crear foodtruck' : 'Verificar mi correo'}
          onPress={() =>
            profile?.emailVerified
              ? router.push({ pathname: '/merchant/[id]', params: { id: 'new' } })
              : router.push('/account')
          }
        />
      </AccountForm>
      {!list && !error && (
        <ActivityIndicator accessibilityLabel="Cargando tus anuncios" color={theme.accent} />
      )}
      {list?.items.length === 0 && (
        <Text style={{ color: theme.text, fontSize: 18 }}>
          Todavía no tienes anuncios. Puedes crear varios con la misma cuenta.
        </Text>
      )}
      {list?.items.map((truck) => (
        <Pressable
          key={truck.id}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: truck.id } })}
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 22,
            gap: 10,
            minHeight: 80,
          }}
        >
          {truck.draft.photos[0] && <PrivatePhoto id={truck.draft.photos[0]} size={112} />}
          <Text style={{ color: theme.text, fontSize: 21, fontWeight: '600' }}>
            {truck.draft.name || 'Anuncio sin nombre'}
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 15 }}>
            {listingStatus[truck.status]}
          </Text>
          {(truck.status === 'draft' || truck.status === 'changes_requested') && (
            <Text style={{ color: theme.secondaryText }}>
              Continuar: {steps[firstIncompleteStep(truck.draft)]}
            </Text>
          )}
          {truck.moderationReason !== '' && (
            <Text style={{ color: theme.text }}>{truck.moderationReason}</Text>
          )}
        </Pressable>
      ))}
      {error !== '' && (
        <View style={{ gap: 12 }}>
          <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>
            {error}
          </Text>
          <AccountForm>
            <Button label="Reintentar" onPress={() => void reload()} />
          </AccountForm>
        </View>
      )}
      {list?.nextCursor && (
        <AccountForm>
          <Button
            label={busy ? 'Cargando…' : 'Ver más anuncios'}
            disabled={busy}
            onPress={() => void more()}
          />
        </AccountForm>
      )}
    </PageShell>
  );
}
