const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');

module.exports = function withFontScale(config) {
  return withAndroidManifest(config, (result) => {
    const activity = AndroidConfig.Manifest.getMainActivityOrThrow(result.modResults);
    const changes = new Set((activity.$['android:configChanges'] || '').split('|').filter(Boolean));
    // RN 0.88 actualiza el layout al recibir onConfigurationChanged; conservar su host.
    changes.add('fontScale');
    activity.$['android:configChanges'] = [...changes].join('|');
    return result;
  });
};
