import { Text as NativeText } from '@expo/ui';
import { FormButton as Button } from '@/components/form-button';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { AccountField, AccountForm } from '@/components/account-form';
import { PageShell } from '@/components/page-shell';
import { useAccount } from '@/features/account/account-context';
import { api, ApiError, jsonBody } from '@/lib/api';
import { useTheme } from '@/theme';
import { useExitGuard } from '@/components/use-exit-guard';

export default function AuthScreen() {
  const params = useLocalSearchParams<{ action?: string; token?: string; email?: string }>();
  const account = useAccount();
  const theme = useTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(
    params.action === 'reset' ? 'reset' : 'login',
  );
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const allowExit = useExitGuard(false, busy);
  const [notice, setNotice] = useState('');
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [formRevision, setFormRevision] = useState(0);
  const title = {
    login: 'Inicia sesión',
    register: 'Crea tu cuenta',
    forgot: 'Recupera tu acceso',
    reset: 'Nueva contraseña',
  }[mode];
  async function perform(action: () => Promise<void>) {
    setBusy(true);
    setNotice('');
    setFields({});
    try {
      await action();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'No se pudo completar la solicitud.');
      if (e instanceof ApiError) setFields(e.fields);
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (params.action === 'verify' && params.token) {
      const result = await api<{ message: string }>(
        '/auth/email/verify',
        { method: 'POST', body: jsonBody({ token: params.token }) },
        false,
      );
      setNotice(result.message);
      router.setParams({ action: undefined, token: undefined });
      return;
    }
    if (mode === 'login') {
      await account.login(email, password);
      allowExit(() => router.dismissTo('/profile'));
      return;
    }
    const result = await api<{ message: string }>(
      mode === 'register'
        ? '/auth/register'
        : mode === 'forgot'
          ? '/auth/password/forgot'
          : '/auth/password/reset',
      {
        method: 'POST',
        body: jsonBody(
          mode === 'register'
            ? { email, password, displayName: name }
            : mode === 'forgot'
              ? { email }
              : { email, password, token: params.token },
        ),
      },
      false,
    );
    setNotice(result.message);
    setPassword('');
    setFormRevision((value) => value + 1);
    if (mode === 'reset') {
      setMode('login');
      router.setParams({ action: undefined, token: undefined });
    }
  }
  if (params.action === 'verify')
    return (
      <PageShell title="Verifica tu correo">
        <AccountForm>
          <Button
            label={busy ? 'Verificando…' : 'Verificar mi correo'}
            disabled={busy}
            onPress={() => void perform(submit)}
          />
        </AccountForm>
        <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>
          {notice}
        </Text>
      </PageShell>
    );
  return (
    <PageShell title={title}>
      <Text style={{ color: theme.secondaryText, fontSize: 16, lineHeight: 24 }}>
        Tu cuenta de Foodtrucks, con correo y contraseña o con Google.
      </Text>
      <AccountForm key={formRevision}>
        {mode === 'register' && (
          <AccountField
            label="Nombre visible"
            initialValue={name}
            onChangeText={setName}
            maxLength={100}
            autoComplete="name"
          />
        )}
        <AccountField
          label="Correo electrónico"
          initialValue={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          maxLength={254}
        />
        {mode !== 'forgot' && (
          <AccountField
            label={mode === 'login' ? 'Contraseña' : 'Contraseña (mínimo 12 caracteres)'}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            maxLength={128}
          />
        )}
        {Object.entries(fields).map(([field, messages]) => (
          <NativeText key={field} textStyle={{ color: theme.accent }}>
            {messages.join(' ')}
          </NativeText>
        ))}
        <Button
          label={busy ? 'Un momento…' : params.action === 'verify' ? 'Verificar mi correo' : title}
          disabled={busy}
          onPress={() => void perform(submit)}
        />
        {mode === 'login' && (
          <Button
            label="Continuar con Google"
            disabled={busy}
            onPress={() =>
              void perform(async () => {
                await account.google();
                allowExit(() => router.dismissTo('/profile'));
              })
            }
            variant="outlined"
          />
        )}
        <Button
          label={mode === 'register' ? 'Ya tengo cuenta' : 'Crear cuenta con correo'}
          variant="text"
          disabled={busy}
          onPress={() => {
            setMode(mode === 'register' ? 'login' : 'register');
            setNotice('');
            setFields({});
          }}
        />
        <Button
          label={mode === 'forgot' ? 'Volver a iniciar sesión' : 'He olvidado mi contraseña'}
          variant="text"
          disabled={busy}
          onPress={() => {
            setMode(mode === 'forgot' ? 'login' : 'forgot');
            setNotice('');
          }}
        />
      </AccountForm>
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
