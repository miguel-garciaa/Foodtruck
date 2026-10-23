import { Text, View } from 'react-native';
import { MenuRow } from '@/components/menu-row';
import { PageShell } from '@/components/page-shell';
import { useTheme } from '@/theme';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <PageShell title="Tu privacidad">
      <Text style={{ color: theme.secondaryText, fontSize: 17, lineHeight: 26 }}>
        Información de la versión DEV de Foodtrucks, en pruebas privadas.
      </Text>
      <View>
        <MenuRow
          icon="person-outline"
          title="Tu cuenta y tu perfil"
          subtitle="Laravel guarda tu correo, nombre, fotografía opcional y preferencias. Google permite identificarte con tu correo y un identificador de cuenta; no solicitamos acceso a Gmail, Drive o contactos."
        />
        <MenuRow
          icon="favorite-border"
          title="Favoritos y anuncios"
          subtitle="Los favoritos se guardan en tu cuenta. Los borradores son privados del propietario; la revisión decide qué versión del anuncio y sus fotos se publica."
        />
        <MenuRow
          icon="location-off"
          title="Explora sin ubicación"
          subtitle="No solicitamos ubicación al abrir la app. Mapbox recibe las solicitudes necesarias para mostrar el mapa. El selector del sistema permite elegir fotos y las notificaciones se activan desde tu cuenta."
        />
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 14, lineHeight: 22 }}>
        Resend gestiona los correos de cuenta cuando está configurado y Firebase Cloud Messaging
        entrega los avisos activados. No hay pagos ni campañas de marketing en este hito. La
        política pública, el responsable y los plazos de conservación deben completarse antes de
        abrir el servicio al público.
      </Text>
    </PageShell>
  );
}
