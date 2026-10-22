import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { api } from '@/lib/api';
import { clearLocalPush, registerPushToken, syncPushRegistration } from '@/lib/push';
import { notificationTarget } from '@/lib/notification-target';
import { useAccount } from './account-context';

export function PushLifecycle() {
  const { profile, loading, setPushNotice } = useAccount();
  const userId = profile?.id;
  const enabled = profile?.pushEnabled;
  const navigation = useRootNavigationState();
  const [intent, setIntent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const show = Boolean(
          enabled && userId && notificationTarget(notification.request.content.data, userId),
        );
        return {
          shouldShowBanner: show,
          shouldShowList: show,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });
    const controller = new AbortController();
    if (!userId || !enabled)
      return () => {
        Notifications.setNotificationHandler(null);
      };
    const failed = () => {
      if (!controller.signal.aborted)
        setPushNotice(
          'No pudimos sincronizar los avisos. Comprueba el permiso de Android y reintenta la activación.',
        );
    };
    const sync = () => {
      void syncPushRegistration(controller.signal).catch(failed);
    };
    sync();
    const tokens = Notifications.addPushTokenListener((token) => {
      void registerPushToken(String(token.data), controller.signal).catch(failed);
    });
    const received = Notifications.addNotificationReceivedListener((notification) => {
      if (notificationTarget(notification.request.content.data, userId))
        setPushNotice('Notificación recibida en este dispositivo.');
    });
    const active = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });
    return () => {
      controller.abort();
      tokens.remove();
      received.remove();
      active.remove();
      Notifications.setNotificationHandler(null);
      void clearLocalPush();
    };
  }, [userId, enabled, setPushNotice]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let active = true;
    const listener = Notifications.addNotificationResponseReceivedListener((response) =>
      setIntent(response.notification.request.content.data ?? null),
    );
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (active && response) setIntent(response.notification.request.content.data ?? null);
    });
    return () => {
      active = false;
      listener.remove();
    };
  }, []);

  useEffect(() => {
    if (!intent || loading || !navigation?.key) return;
    if (!userId) {
      router.push('/auth');
      return;
    }
    const controller = new AbortController();
    async function open() {
      await Notifications.clearLastNotificationResponseAsync();
      const target = notificationTarget(intent!, userId!);
      if (controller.signal.aborted) return;
      if (!target) {
        setIntent(null);
        return;
      }
      if (target.truckId) {
        // The push is a hint. Laravel authorizes the destination before opening it.
        await api('/merchant/foodtrucks/' + target.truckId, { signal: controller.signal });
        if (!controller.signal.aborted)
          router.push({ pathname: '/merchant/[id]', params: { id: target.truckId } });
      } else router.push('/account');
      if (!controller.signal.aborted) setIntent(null);
    }
    void open().catch(() => {
      if (!controller.signal.aborted) {
        setIntent(null);
        setPushNotice('La actualización ya no está disponible para esta cuenta.');
        router.push('/account');
      }
    });
    return () => controller.abort();
  }, [intent, loading, userId, navigation?.key, setPushNotice]);
  return null;
}
