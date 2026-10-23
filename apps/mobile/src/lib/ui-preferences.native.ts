import * as SecureStore from 'expo-secure-store';
const key = 'foodtrucks.favorite-help.v1';
let seenThisSession = false;
export async function readFavoriteHelp() {
  if (seenThisSession) return true;
  try {
    return (await SecureStore.getItemAsync(key)) === 'seen';
  } catch {
    return false;
  }
}
export async function rememberFavoriteHelp() {
  seenThisSession = true;
  try {
    await SecureStore.setItemAsync(key, 'seen', {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    /* Keep this session quiet when local storage is unavailable. */
  }
}
