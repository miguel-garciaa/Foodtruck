import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import type { components } from '@/generated/api';
import {
  acceptSession,
  assertSessionVersion,
  api,
  ApiError,
  clearSession,
  jsonBody,
  onSessionLost,
  restoreSession,
  sessionVersion,
} from '@/lib/api';
import { googleSignIn, googleSignOut } from '../../../modules/foodtrucks-google/src';
import { clearLocalPush } from '@/lib/push';

export type Profile = components['schemas']['Profile'];
type Session = components['schemas']['Session'];

function useAccountState() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pushNotice, setPushNotice] = useState('');
  const identity = sessionVersion();
  async function reload(expected = identity) {
    assertSessionVersion(expected);
    const next = await api<Profile>('/me');
    assertSessionVersion(expected);
    setProfile(next);
  }
  async function restore() {
    setLoading(true);
    setError('');
    try {
      await restoreSession();
      await reload();
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401))
        setError('No se pudo conectar con tu cuenta. Comprueba la conexión y reintenta.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    const unsubscribe = onSessionLost(() => {
      setProfile(null);
      setPushNotice('');
    });
    async function initialize() {
      try {
        await restoreSession();
        const next = await api<Profile>('/me');
        if (active) setProfile(next);
      } catch (e) {
        if (active && !(e instanceof ApiError && e.status === 401))
          setError('No se pudo conectar con tu cuenta. Comprueba la conexión y reintenta.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void initialize();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  async function login(email: string, password: string) {
    const session = await api<Session>(
      '/auth/login',
      { method: 'POST', body: jsonBody({ email, password }) },
      false,
    );
    assertSessionVersion(identity);
    await acceptSession(session);
    await reload(sessionVersion());
  }
  async function google(link = false) {
    const challenge = await api<components['schemas']['GoogleChallenge']>(
      '/auth/google/challenge',
      { method: 'POST' },
      false,
    );
    const idToken = await googleSignIn(challenge.nonce);
    assertSessionVersion(identity);
    const result = await api<Session>(
      link ? '/me/google' : '/auth/google',
      { method: 'POST', body: jsonBody({ challengeId: challenge.challengeId, idToken }) },
      link,
    );
    if (!link) {
      assertSessionVersion(identity);
      await acceptSession(result);
    }
    await reload(sessionVersion());
  }
  async function update(changes: Partial<components['schemas']['ProfileUpdate']>) {
    assertSessionVersion(identity);
    if (!profile) throw new ApiError(401, 'Inicia sesión.');
    const { displayName, avatarId, mode, pushEnabled } = profile;
    const next = await api<Profile>('/me', {
      method: 'PUT',
      body: jsonBody({ displayName, avatarId, mode, pushEnabled, ...changes }),
    });
    setProfile(next);
    return next;
  }
  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    await clearSession();
    setProfile(null);
    await Promise.allSettled([clearLocalPush(), googleSignOut()]);
  }
  return {
    profile,
    loading,
    error,
    login,
    google,
    logout,
    update,
    reload,
    restore,
    pushNotice,
    setPushNotice,
  };
}
const AccountContext = createContext<ReturnType<typeof useAccountState> | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  return <AccountContext value={useAccountState()}>{children}</AccountContext>;
}
export function useAccount() {
  const value = use(AccountContext);
  if (!value) throw new Error('AccountProvider no está disponible.');
  return value;
}
