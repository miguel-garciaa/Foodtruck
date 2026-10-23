import type { components } from '@/generated/api';
import { deleteRefresh, readRefresh, writeRefresh } from './session-store';

type Session = components['schemas']['Session'];
export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;
  constructor(status: number, message: string, fields: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8085/api/v1';
const base = new URL(apiUrl);
if (
  base.protocol !== 'https:' &&
  !(base.protocol === 'http:' && base.hostname === '127.0.0.1' && __DEV__)
) {
  throw new Error('La API requiere HTTPS; HTTP solo está permitido en el loopback DEV por SSH.');
}
let session: Session | null = null;
let generation = 0;
let renewing: { generation: number; promise: Promise<void> } | null = null;
let sessionLost: (() => void) | null = null;
let storageWrite: Promise<void> = Promise.resolve();
export const sessionVersion = () => generation;
export function assertSessionVersion(expected: number) {
  if (expected !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
}
function persist(operation: () => Promise<void>) {
  const next = storageWrite.then(operation, operation);
  storageWrite = next.catch(() => {});
  return next;
}

export function onSessionLost(callback: () => void) {
  sessionLost = callback;
  return () => {
    if (sessionLost === callback) sessionLost = null;
  };
}

async function send<T>(path: string, options: RequestInit = {}, access?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (access) headers.set('Authorization', `Bearer ${access}`);
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)])
    : AbortSignal.timeout(15000);
  const response = await fetch(apiUrl + path, { ...options, headers, signal }).catch(() => {
    throw new ApiError(
      0,
      'No pudimos conectar. Comprueba la conexión y reintenta; tus cambios siguen aquí.',
    );
  });
  if (response.status === 204) return undefined as T;
  if (response.ok && response.headers.get('Content-Type')?.startsWith('image/'))
    return (await response.blob()) as T;
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, 'La API no ha devuelto una respuesta válida.');
  }
  if (!response.ok)
    throw new ApiError(
      response.status,
      body.message ?? 'No se pudo completar la solicitud.',
      body.errors ?? {},
    );
  return body as T;
}

export async function clearSession() {
  generation++;
  session = null;
  sessionLost?.();
  await persist(deleteRefresh);
}

export async function acceptSession(value: Session) {
  if (!value.accessToken || !value.refreshToken || value.expiresIn !== 900)
    throw new ApiError(502, 'Sesión no válida.');
  const snapshot = ++generation;
  session = null;
  sessionLost?.();
  await persist(async () => {
    if (snapshot === generation) await writeRefresh(value.refreshToken);
  });
  if (snapshot !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
  session = value;
}

export async function restoreSession(): Promise<void> {
  if (renewing?.generation === generation) return renewing.promise;
  const snapshot = generation;
  const attempt = (async () => {
    await storageWrite;
    const token = session?.refreshToken ?? (await readRefresh());
    if (snapshot !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
    if (!token) throw new ApiError(401, 'Inicia sesión.');
    try {
      const next = await send<Session>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      if (!next.accessToken || !next.refreshToken || next.expiresIn !== 900)
        throw new ApiError(502, 'Sesión no válida.');
      await persist(async () => {
        if (snapshot === generation) await writeRefresh(next.refreshToken);
      });
      if (snapshot !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
      // Refresh rotates credentials within the same account; it does not change identity.
      session = next;
    } catch (error) {
      if (snapshot === generation && error instanceof ApiError && error.status === 401)
        await clearSession();
      throw error;
    }
  })().finally(() => {
    if (renewing?.promise === attempt) renewing = null;
  });
  renewing = { generation: snapshot, promise: attempt };
  return attempt;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  if (!authenticated) return send<T>(path, options);
  const sentGeneration = generation;
  if (!session) await restoreSession();
  if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
  const sentAccess = session?.accessToken;
  try {
    const result = await send<T>(path, options, sentAccess);
    if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
    return result;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
    // A request using an older access token must reuse the refresh already completed by another request.
    if (session?.accessToken === sentAccess) await restoreSession();
    if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
    if (!session) throw new ApiError(401, 'Inicia sesión.');
    try {
      const result = await send<T>(path, options, session.accessToken);
      if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
      return result;
    } catch (retryError) {
      if (sentGeneration !== generation) throw new ApiError(409, 'La sesión ha cambiado.');
      if (retryError instanceof ApiError && retryError.status === 401) await clearSession();
      throw retryError;
    }
  }
}

export const jsonBody = (value: unknown) => JSON.stringify(value);
