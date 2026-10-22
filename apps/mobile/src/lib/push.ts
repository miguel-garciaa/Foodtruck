import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, AndroidNotificationVisibility } from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { api, assertSessionVersion, jsonBody, sessionVersion } from './api';

let installation: Promise<string> | null = null;
let deviceOperations: Promise<unknown> = Promise.resolve();
function deviceOperation<T>(operation: () => Promise<T>): Promise<T> {
  const next = deviceOperations.then(operation, operation);
  deviceOperations = next.catch(() => {});
  return next;
}
export function installationId(): Promise<string> {
  installation ??= loadInstallation().catch((error) => {
    installation = null;
    throw error;
  });
  return installation;
}
async function loadInstallation() {
  const key = 'foodtrucks.dev.installation.v1';
  const existing = await SecureStore.getItemAsync(key);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await SecureStore.setItemAsync(key, id);
  return id;
}
async function savePushToken(token: string, expected: number, signal?: AbortSignal) {
  const id = await installationId();
  if (signal?.aborted) return;
  assertSessionVersion(expected);
  await api('/me/devices', {
    method: 'PUT',
    signal,
    body: jsonBody({ installationId: id, token, platform: 'android', environment: 'dev' }),
  });
}
export function registerPushToken(token: string, signal?: AbortSignal) {
  const expected = sessionVersion();
  return deviceOperation(() => savePushToken(token, expected, signal));
}
export function syncPushRegistration(signal: AbortSignal) {
  const expected = sessionVersion();
  return deviceOperation(async () => {
    if (Platform.OS !== 'android') return;
    const permission = await Notifications.getPermissionsAsync();
    if (signal.aborted) return;
    if (!permission.granted) {
      const id = await installationId();
      assertSessionVersion(expected);
      if (!signal.aborted)
        await api('/me/devices', {
          method: 'DELETE',
          signal,
          body: jsonBody({ installationId: id }),
        });
      throw new Error('Las notificaciones están desactivadas en Android.');
    }
    const token = await Notifications.getDevicePushTokenAsync();
    if (!signal.aborted) await savePushToken(String(token.data), expected, signal);
  });
}
export function clearLocalPush() {
  return deviceOperation(async () => {
    if (Platform.OS !== 'android') return;
    await Promise.allSettled([
      Notifications.unregisterForNotificationsAsync(),
      Notifications.dismissAllNotificationsAsync(),
      Notifications.clearLastNotificationResponseAsync(),
    ]);
  });
}
export async function enablePush(onGranted: () => Promise<unknown>) {
  const expected = sessionVersion();
  if (Platform.OS !== 'android') throw new Error('Esta prueba push está disponible en Android.');
  await Notifications.setNotificationChannelAsync('account', {
    name: 'Actualizaciones de tu cuenta',
    importance: AndroidImportance.DEFAULT,
    lockscreenVisibility: AndroidNotificationVisibility.PRIVATE,
  });
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      'No has permitido las notificaciones. Puedes activarlas en los ajustes de Android.',
    );
  assertSessionVersion(expected);
  await onGranted();
  assertSessionVersion(expected);
  await syncPushRegistration(new AbortController().signal);
}
export async function testPush() {
  await api('/me/devices/test', {
    method: 'POST',
    body: jsonBody({ installationId: await installationId() }),
  });
}
