import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { PageShell } from '@/components/page-shell';
import { Icon } from '@/components/icon';
import { MenuRow } from '@/components/menu-row';
import { ActionButton } from '@/components/action-button';
import { PrivatePhoto } from '@/components/private-photo';
import { useDockSpace } from '@/components/use-dock-space';
import { useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';
import { useDiscovery } from '@/features/discovery/discovery-context';

export default function ProfileScreen() {
  const theme = useTheme();
  const bottomSpace = useDockSpace();
  const account = useAccount();
  const { favoriteIds } = useDiscovery();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const owner = account.profile?.mode === 'owner';
  async function act(action: () => Promise<unknown>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice('');
    try {
      await action();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo completar la solicitud.');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  function switchMode() {
    if (!account.profile) {
      router.push('/auth');
      return;
    }
    void act(async () => {
      await account.update({ mode: owner ? 'client' : 'owner' });
      router.replace('/');
    });
  }
  return (
    <PageShell title={owner ? 'Menú' : 'Perfil'} showBack={false} bottomInset={bottomSpace}>
      {account.profile ? (
        <View
          style={{
            padding: 24,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            gap: 12,
            alignItems: 'center',
          }}
        >
          {account.profile.avatarId ? (
            <PrivatePhoto
              key={account.profile.id + account.profile.avatarId}
              id={account.profile.avatarId}
            />
          ) : (
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.softAccent,
              }}
            >
              <Icon name="person-outline" size={40} color={theme.accent} />
            </View>
          )}
          <Text style={{ color: theme.text, fontSize: 23, fontWeight: '600' }}>
            {account.profile.displayName}
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 15 }}>
            {owner ? 'Comerciante' : 'Cliente'} ·{' '}
            {account.profile.emailVerified ? 'Correo verificado' : 'Correo sin verificar'}
          </Text>
          <ActionButton
            label="Editar perfil y seguridad"
            variant="text"
            disabled={busy}
            onPress={() => router.push('/account')}
          />
        </View>
      ) : (
        <View style={{ gap: 20 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 16, lineHeight: 24 }}>
            Descubre nuevos sabores y guarda las paradas a las que quieres volver.
          </Text>
          <ActionButton
            label={account.loading ? 'Recuperando sesión…' : 'Iniciar sesión o registrarme'}
            variant="neutral"
            disabled={account.loading}
            onPress={() => router.push('/auth')}
          />
        </View>
      )}
      {!owner && (
        <View
          style={{
            padding: 24,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 12,
          }}
        >
          <Icon name="storefront" color={theme.accent} size={32} />
          <Text style={{ color: theme.text, fontSize: 19, fontWeight: '600' }}>
            Gestionar mi foodtruck
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 15, lineHeight: 22 }}>
            Presenta tu puesto, prepara tu carta y crea tu anuncio paso a paso.
          </Text>
          <ActionButton
            label="Cambiar a comerciante"
            variant="outlined"
            loading={busy}
            onPress={switchMode}
          />
        </View>
      )}
      <View pointerEvents={busy ? 'none' : 'auto'}>
        {owner && (
          <>
            <MenuRow
              icon="storefront"
              title="Mis foodtrucks"
              onPress={() => router.navigate('/')}
            />
            <MenuRow
              icon="add"
              title="Crear foodtruck"
              onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: 'new' } })}
            />
          </>
        )}
        {!owner && (
          <MenuRow
            icon="favorite-border"
            title="Mis favoritos"
            subtitle={`${favoriteIds.length} paradas guardadas`}
            onPress={() => router.push('/favorites')}
          />
        )}
        <MenuRow
          icon="receipt-long"
          title={owner ? 'Pedidos de mis foodtrucks' : 'Tus pedidos'}
          onPress={() => router.navigate('/orders')}
        />
        {account.profile && (
          <MenuRow
            icon="settings"
            title="Cuenta y seguridad"
            onPress={() => router.push('/account')}
          />
        )}
        <MenuRow icon="tune" title="Preferencias" onPress={() => router.push('/preferences')} />
        <MenuRow icon="help-outline" title="Recibe ayuda" onPress={() => router.push('/help')} />
        <MenuRow
          icon="pan-tool-alt"
          title="Tu privacidad"
          onPress={() => router.push('/privacy')}
        />
        {account.profile && (
          <MenuRow icon="logout" title="Cerrar sesión" onPress={() => void act(account.logout)} />
        )}
      </View>
      {owner && (
        <ActionButton
          label="Cambiar a cliente"
          variant="neutral"
          loading={busy}
          onPress={switchMode}
        />
      )}
      {account.error !== '' && (
        <ActionButton
          label="Reintentar conexión"
          variant="text"
          onPress={() => void account.restore()}
        />
      )}
      {(notice || account.error) !== '' && (
        <Text
          selectable
          accessibilityLiveRegion="polite"
          style={{ color: theme.text, fontSize: 16 }}
        >
          {notice || account.error}
        </Text>
      )}
      <Text style={{ color: theme.secondaryText, fontSize: 13 }}>Foodtrucks DEV</Text>
    </PageShell>
  );
}
