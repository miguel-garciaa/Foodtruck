import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Button } from '@expo/ui';
import type { components } from '@/generated/api';
import { api } from '@/lib/api';
import { AccountForm } from '@/components/account-form';
import { useAccount } from '@/features/account/account-context';
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
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 130, gap: 24 }}>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 32, fontWeight: '700' }}
        >
          Mis foodtrucks
        </Text>
        <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
          Gestiona tus anuncios. Los cambios se publican después de la revisión.
        </Text>
        <AccountForm>
          <Button
            label={profile?.emailVerified ? 'Crear anuncio' : 'Verificar mi correo'}
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
            <Text style={{ color: theme.text, fontSize: 21, fontWeight: '600' }}>
              {truck.draft.name || 'Anuncio sin nombre'}
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 15 }}>
              {listingStatus[truck.status]}
            </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
