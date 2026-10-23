import * as SecureStore from 'expo-secure-store';

const key = 'foodtrucks.dev.refresh.v1';
export const readRefresh = () => SecureStore.getItemAsync(key);
export const writeRefresh = (token: string) =>
  SecureStore.setItemAsync(key, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
export const deleteRefresh = () => SecureStore.deleteItemAsync(key);
