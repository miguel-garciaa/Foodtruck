import { requireOptionalNativeModule } from 'expo';

type GoogleModule = {
  signIn(clientId: string, nonce: string): Promise<string>;
  signOut(): Promise<void>;
};

export function googleSignIn(nonce: string): Promise<string> {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const module = requireOptionalNativeModule<GoogleModule>('FoodtrucksGoogle');
  if (!module || !clientId)
    throw new Error('Google todavía no está configurado en esta compilación DEV.');
  return module.signIn(clientId, nonce);
}

export async function googleSignOut(): Promise<void> {
  await requireOptionalNativeModule<GoogleModule>('FoodtrucksGoogle')?.signOut();
}
