import { Text, View } from 'react-native';
import { MenuRow } from '@/components/menu-row';
import { PageShell } from '@/components/page-shell';
import { useTheme } from '@/theme';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <PageShell title="Tu privacidad">
      <Text style={{ color: theme.secondaryText, fontSize: 17, lineHeight: 26 }}>
        Así funciona esta demostración de Foodtrucks.
      </Text>
      <View>
        <MenuRow
          icon="person-outline"
          title="Sin cuenta iniciada"
          subtitle="No se solicitan nombre, correo ni datos de pago."
        />
        <MenuRow
          icon="favorite-border"
          title="Guardados durante la sesión"
          subtitle="Los favoritos y filtros viven en la memoria de la app. No se envían a un servidor de Foodtrucks."
        />
        <MenuRow
          icon="location-off"
          title="Explora sin ubicación"
          subtitle="La app no solicita permisos de ubicación, cámara o notificaciones al abrirse."
        />
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 14, lineHeight: 22 }}>
        Información sobre la versión de demostración. No sustituye la política de privacidad del
        servicio que se publique en el futuro.
      </Text>
    </PageShell>
  );
}
