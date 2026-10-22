import { Button, Text as NativeText } from '@expo/ui';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Text } from 'react-native';
import type { components } from '@/generated/api';
import { PageShell } from '@/components/page-shell';
import { AccountField, AccountForm } from '@/components/account-form';
import { useAccount } from '@/features/account/account-context';
import {
  api,
  ApiError,
  assertSessionVersion,
  clearSession,
  jsonBody,
  sessionVersion,
} from '@/lib/api';
import { clearLocalPush, enablePush, testPush } from '@/lib/push';
import { useTheme } from '@/theme';
import { PrivatePhoto } from '@/components/private-photo';

export default function AccountScreen() {
  const account = useAccount();
  const theme = useTheme();
  const [name, setName] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function act(action: () => Promise<unknown>, success = 'Cambios guardados.') {
    setBusy(true);
    setNotice('');
    try {
      await action();
      setNotice(success);
    } catch (e) {
      setNotice(
        e instanceof ApiError && Object.keys(e.fields).length
          ? Object.values(e.fields).flat().join(' ')
          : e instanceof Error
            ? e.message
            : 'No se pudo completar la solicitud.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function avatar() {
    const expected = sessionVersion();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      exif: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 8 * 1024 * 1024)
      throw new Error('Elige una fotografía de hasta 8 MB.');
    const file = await fetch(asset.uri);
    const bytes = await file.blob();
    assertSessionVersion(expected);
    const media = await api<components['schemas']['Media']>('/me/media', {
      method: 'POST',
      headers: { 'Content-Type': asset.mimeType ?? 'image/jpeg' },
      body: bytes,
    });
    await account.update({ avatarId: media.id });
  }
  if (!account.profile)
    return (
      <PageShell title="Tu cuenta">
        <AccountForm>
          <Button label="Iniciar sesión" onPress={() => router.replace('/auth')} />
        </AccountForm>
      </PageShell>
    );
  return (
    <PageShell title="Tu cuenta">
      {account.profile.avatarId && (
        <PrivatePhoto
          key={account.profile.id + account.profile.avatarId}
          id={account.profile.avatarId}
        />
      )}
      <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
        {account.profile.email} ·{' '}
        {account.profile.emailVerified ? 'Verificado' : 'Pendiente de verificar'}
      </Text>
      <AccountForm>
        <AccountField
          key={account.profile.id}
          label="Nombre visible"
          initialValue={account.profile.displayName}
          onChangeText={setName}
          maxLength={100}
        />
        <Button
          label="Guardar nombre"
          disabled={busy}
          onPress={() =>
            void act(() => account.update({ displayName: name ?? account.profile!.displayName }))
          }
        />
        <Button
          label="Elegir fotografía de perfil"
          variant="outlined"
          disabled={busy}
          onPress={() => void act(avatar)}
        />
        {account.profile.avatarId && (
          <Button
            label="Quitar fotografía"
            variant="text"
            disabled={busy}
            onPress={() => void act(() => account.update({ avatarId: null }))}
          />
        )}
        {!account.profile.emailVerified && (
          <Button
            label="Reenviar verificación"
            disabled={busy}
            onPress={() =>
              void act(() =>
                api(
                  '/auth/email/resend',
                  { method: 'POST', body: jsonBody({ email: account.profile!.email }) },
                  false,
                ),
              )
            }
          />
        )}
        <NativeText textStyle={{ color: theme.text, fontSize: 22, fontWeight: '600' }}>
          Seguridad
        </NativeText>
        <AccountField
          label="Contraseña actual"
          secureTextEntry
          autoComplete="current-password"
          onChangeText={setCurrentPassword}
          maxLength={128}
        />
        <AccountField
          label="Nueva contraseña (mínimo 12 caracteres)"
          secureTextEntry
          autoComplete="new-password"
          onChangeText={setPassword}
          maxLength={128}
        />
        <Button
          label="Cambiar contraseña y cerrar sesiones"
          disabled={busy}
          onPress={() =>
            void act(async () => {
              await api('/me/password', {
                method: 'POST',
                body: jsonBody({ currentPassword, password }),
              });
              await clearSession();
              router.replace('/auth');
            })
          }
        />
        <Button
          label="Vincular mi cuenta con Google"
          variant="outlined"
          disabled={busy}
          onPress={() => void act(() => account.google(true))}
        />
        <NativeText textStyle={{ color: theme.text, fontSize: 22, fontWeight: '600' }}>
          Notificaciones
        </NativeText>
        <NativeText textStyle={{ color: theme.secondaryText, fontSize: 15 }}>
          Avisos de revisión y publicación. Puedes desactivarlos cuando quieras.
        </NativeText>
        <Button
          label="Activar en este dispositivo"
          disabled={busy}
          onPress={() =>
            void act(async () => {
              await enablePush(() => account.update({ pushEnabled: true }));
            })
          }
        />
        <Button
          label="Desactivar notificaciones de mi cuenta"
          variant="text"
          disabled={busy}
          onPress={() =>
            void act(async () => {
              await account.update({ pushEnabled: false });
              await clearLocalPush();
            })
          }
        />
        <Button
          label="Enviar prueba a este dispositivo"
          variant="outlined"
          disabled={busy}
          onPress={() =>
            void act(testPush, 'Prueba encolada para este dispositivo. Espera la notificación.')
          }
        />
      </AccountForm>
      {account.pushNotice !== '' && (
        <Text accessibilityLiveRegion="polite" style={{ color: theme.secondaryText }}>
          {account.pushNotice}
        </Text>
      )}
      {notice !== '' && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ color: theme.text, fontSize: 16, lineHeight: 24 }}
        >
          {notice}
        </Text>
      )}
    </PageShell>
  );
}
