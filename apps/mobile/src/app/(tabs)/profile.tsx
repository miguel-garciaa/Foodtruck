import { router } from 'expo-router';
import { useState } from 'react';
import { Button } from '@expo/ui';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/icon';
import { MenuRow } from '@/components/menu-row';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';
import { useAccount } from '@/features/account/account-context';
import { AccountForm } from '@/components/account-form';
import { PrivatePhoto } from '@/components/private-photo';

export default function ProfileScreen() {
  const theme = useTheme();
  const { favoriteIds } = useDiscovery();
  const account = useAccount();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function act(action: () => Promise<unknown>) {
    setBusy(true);
    setNotice('');
    try {
      await action();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'No se pudo completar la solicitud.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 12, paddingBottom: 120, gap: 24 }}
      >
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 30, fontWeight: '700' }}
        >
          Perfil
        </Text>
        <View
          style={{
            padding: 32,
            backgroundColor: theme.surface,
            borderRadius: 28,
            gap: 14,
            alignItems: 'center',
            boxShadow: '0 4px 22px rgba(0,0,0,0.06)',
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: theme.softAccent,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {account.profile?.avatarId ? (
              <PrivatePhoto
                key={account.profile.id + account.profile.avatarId}
                id={account.profile.avatarId}
              />
            ) : (
              <Icon name="person-outline" color={theme.accent} size={42} />
            )}
          </View>
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '600' }}>
            {account.profile?.displayName ?? 'A tu aire, a tu gusto'}
          </Text>
          <Text
            style={{
              color: theme.secondaryText,
              fontSize: 16,
              lineHeight: 25,
              textAlign: 'center',
            }}
          >
            {account.profile
              ? account.profile.email
              : 'Descubre nuevos sabores y guarda las paradas a las que quieres volver.'}
          </Text>
        </View>
        <AccountForm>
          {account.profile ? (
            <>
              <Button label="Editar perfil y seguridad" onPress={() => router.push('/account')} />
              <Button
                label={
                  account.profile.mode === 'owner' ? 'Cambiar a cliente' : 'Cambiar a propietario'
                }
                disabled={busy}
                onPress={() =>
                  void act(() =>
                    account.update({
                      mode: account.profile?.mode === 'owner' ? 'client' : 'owner',
                    }),
                  )
                }
                variant="outlined"
              />
              <Button
                label="Cerrar sesión"
                disabled={busy}
                variant="text"
                onPress={() => void act(account.logout)}
              />
            </>
          ) : (
            <>
              <Button
                label={account.loading ? 'Recuperando sesión…' : 'Iniciar sesión o registrarme'}
                disabled={account.loading}
                onPress={() => router.push('/auth')}
              />
              {account.error !== '' && (
                <Button
                  label="Reintentar conexión"
                  onPress={() => void account.restore()}
                  variant="text"
                />
              )}
            </>
          )}
        </AccountForm>
        {(notice || account.error) !== '' && (
          <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 16 }}>
            {notice || account.error}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mis favoritos. ${favoriteIds.length} paradas guardadas`}
          onPress={() => router.push('/favorites')}
          style={{
            minHeight: 110,
            padding: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 18,
            borderRadius: 24,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Icon name="favorite-border" color={theme.accent} size={32} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ fontSize: 19, fontWeight: '600', color: theme.text }}>
              Mis favoritos
            </Text>
            <Text style={{ fontSize: 14, color: theme.secondaryText }}>
              {favoriteIds.length === 1
                ? '1 parada guardada'
                : `${favoriteIds.length} paradas guardadas`}
            </Text>
          </View>
          <Icon name="chevron-right" color={theme.secondaryText} />
        </Pressable>
        <View>
          <MenuRow
            icon="receipt-long"
            title="Tus pedidos"
            onPress={() => router.navigate('/orders')}
          />
          <MenuRow icon="tune" title="Preferencias" onPress={() => router.push('/preferences')} />
          <MenuRow icon="help-outline" title="Recibe ayuda" onPress={() => router.push('/help')} />
          <MenuRow
            icon="pan-tool-alt"
            title="Tu privacidad"
            onPress={() => router.push('/privacy')}
          />
        </View>
        <Text style={{ fontSize: 13, lineHeight: 22, color: theme.secondaryText }}>
          Foodtrucks DEV
          {account.profile
            ? ` · ${account.profile.emailVerified ? 'Correo verificado' : 'Verificación pendiente'}`
            : ' · Explora y accede a tu cuenta cuando quieras.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
