import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { afterEach, beforeEach, test } from 'node:test';

// Node uses the in-memory web store; Metro selects SecureStore on Android.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './session-store')
      return { url: new URL('./session-store.ts', context.parentURL).href, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test/api/v1';
const { acceptSession, api, ApiError, clearSession } = await import('./api.ts');
const { readRefresh } = await import('./session-store.ts');
const originalFetch = globalThis.fetch;
const credentials = (id: string) => ({
  accessToken: `access-${id}`,
  refreshToken: `refresh-${id}`,
  expiresIn: 900,
});
const response = (body: unknown, status = 200) => Response.json(body, { status });
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
function mockFetch(handler: (path: string, access: string | null) => Promise<Response> | Response) {
  globalThis.fetch = async (input, options) =>
    handler(new URL(String(input)).pathname, new Headers(options?.headers).get('Authorization'));
}
beforeEach(async () => {
  await clearSession();
});
afterEach(async () => {
  globalThis.fetch = originalFetch;
  await clearSession();
});

test('una respuesta 401 de la cuenta anterior nunca se reintenta con la cuenta nueva', async () => {
  await acceptSession(credentials('a'));
  const old = deferred<Response>();
  const started = deferred<void>();
  let calls = 0;
  mockFetch(() => {
    calls++;
    if (calls === 1) {
      started.resolve();
      return old.promise;
    }
    return response({ id: 'b' });
  });
  const request = api('/me');
  await started.promise;
  await acceptSession(credentials('b'));
  old.resolve(response({ message: 'No autenticado.' }, 401));
  await assert.rejects(
    request,
    (error: unknown) => error instanceof ApiError && error.status === 409,
  );
  assert.equal(calls, 1);
});

test('dos peticiones con el token vencido comparten una sola renovación', async () => {
  await acceptSession(credentials('a'));
  const refresh = deferred<Response>();
  const started = deferred<void>();
  let refreshes = 0;
  mockFetch((path, access) => {
    if (path.endsWith('/auth/refresh')) {
      refreshes++;
      started.resolve();
      return refresh.promise;
    }
    return access === 'Bearer access-next'
      ? response({ id: 'a' })
      : response({ message: 'Vencido.' }, 401);
  });
  const first = api('/me');
  const second = api('/me');
  await started.promise;
  refresh.resolve(response(credentials('next')));
  assert.deepEqual(await Promise.all([first, second]), [{ id: 'a' }, { id: 'a' }]);
  assert.equal(refreshes, 1);
});

test('una renovación no invalida otra respuesta válida de la misma cuenta', async () => {
  await acceptSession(credentials('a'));
  const slow = deferred<Response>();
  mockFetch((path, access) => {
    if (path.endsWith('/slow')) return slow.promise;
    if (path.endsWith('/auth/refresh')) return response(credentials('next'));
    return access === 'Bearer access-next' ? response({ id: 'a' }) : response({}, 401);
  });
  const pending = api('/slow');
  await api('/me');
  slow.resolve(response({ id: 'a' }));
  assert.deepEqual(await pending, { id: 'a' });
});

test('logout durante la renovación impide restaurar las credenciales antiguas', async () => {
  await acceptSession(credentials('a'));
  const refresh = deferred<Response>();
  const started = deferred<void>();
  mockFetch((path) => {
    if (path.endsWith('/auth/refresh')) {
      started.resolve();
      return refresh.promise;
    }
    return response({}, 401);
  });
  const pending = api('/me');
  await started.promise;
  await clearSession();
  refresh.resolve(response(credentials('next')));
  await assert.rejects(
    pending,
    (error: unknown) => error instanceof ApiError && [401, 409].includes(error.status),
  );
  assert.equal(await readRefresh(), null);
});

test('una respuesta del reintento también se descarta si cambia la cuenta', async () => {
  await acceptSession(credentials('a'));
  const retry = deferred<Response>();
  const started = deferred<void>();
  mockFetch((path, access) => {
    if (path.endsWith('/auth/refresh')) return response(credentials('next'));
    if (access === 'Bearer access-next') {
      started.resolve();
      return retry.promise;
    }
    return response({}, 401);
  });
  const pending = api('/me');
  await started.promise;
  await acceptSession(credentials('b'));
  retry.resolve(response({ id: 'a' }));
  await assert.rejects(
    pending,
    (error: unknown) => error instanceof ApiError && error.status === 409,
  );
});

test('una renovación rechazada borra la sesión persistida', async () => {
  await acceptSession(credentials('a'));
  mockFetch(() => response({ message: 'No autenticado.' }, 401));
  await assert.rejects(
    api('/me'),
    (error: unknown) => error instanceof ApiError && error.status === 401,
  );
  assert.equal(await readRefresh(), null);
});

test('las fotografías privadas usan la misma sesión y devuelven sus bytes', async () => {
  await acceptSession(credentials('a'));
  mockFetch((_path, access) => {
    assert.equal(access, 'Bearer access-a');
    return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/jpeg' } });
  });
  const photo = await api<Blob>('/media/synthetic-id');
  assert.deepEqual([...new Uint8Array(await photo.arrayBuffer())], [1, 2, 3]);
});
