const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

module.exports = function withCiTls(config) {
  if (process.env.FOODTRUCKS_CI !== '1' || config.android?.package !== 'com.foodtrucks.ci')
    throw new Error('El certificado sintético solo pertenece al APK aislado de CI.');
  config = withAndroidManifest(config, (result) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(result.modResults);
    application.$['android:networkSecurityConfig'] = '@xml/ci_network_security';
    return result;
  });
  return withDangerousMod(config, [
    'android',
    async (result) => {
      const root = path.join(result.modRequest.platformProjectRoot, 'app/src/main/res');
      fs.mkdirSync(path.join(root, 'raw'), { recursive: true });
      fs.mkdirSync(path.join(root, 'xml'), { recursive: true });
      fs.copyFileSync(process.env.FOODTRUCKS_CI_CERT, path.join(root, 'raw/ci_certificate.pem'));
      fs.writeFileSync(
        path.join(root, 'xml/ci_network_security.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false"><trust-anchors><certificates src="system" /></trust-anchors></base-config>
  <domain-config cleartextTrafficPermitted="false"><domain>localhost</domain><trust-anchors><certificates src="@raw/ci_certificate" /></trust-anchors></domain-config>
</network-security-config>`,
      );
      return result;
    },
  ]);
};
