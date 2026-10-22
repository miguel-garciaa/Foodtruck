import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // CI builds the real native modules with synthetic configuration, without Firebase credentials.
  if (process.env.FOODTRUCKS_CI !== '1') return config as ExpoConfig;
  const android = { ...config.android };
  delete android.googleServicesFile;
  android.package = 'com.foodtrucks.ci';
  return {
    ...config,
    name: 'Foodtrucks Pruebas',
    slug: 'foodtrucks-dev',
    android,
    plugins: [...(config.plugins ?? []), './plugins/with-ci-tls.cjs'],
  } as ExpoConfig;
};
