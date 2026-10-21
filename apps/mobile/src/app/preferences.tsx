import { Text, View } from 'react-native';
import { MenuRow } from '@/components/menu-row';
import { PageShell } from '@/components/page-shell';
import { useTheme } from '@/theme';

export default function PreferencesScreen() {
  const theme = useTheme();
  return (
    <PageShell title="Preferencias">
      <View>
        <MenuRow
          icon="contrast"
          title="Apariencia"
          subtitle="Automática · Sigue el tema de tu dispositivo"
        />
        <MenuRow
          icon="text-fields"
          title="Tamaño del texto"
          subtitle="Se adapta al tamaño elegido en los ajustes de Android"
        />
        <MenuRow icon="language" title="Idioma" subtitle="Español en esta primera versión" />
      </View>
      <View style={{ paddingTop: 24, borderTopWidth: 1, borderColor: theme.border, gap: 12 }}>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 22, fontWeight: '600' }}
        >
          A tu manera
        </Text>
        <Text style={{ color: theme.secondaryText, fontSize: 16, lineHeight: 25 }}>
          Puedes cambiar el tema y el tamaño de letra en los ajustes de tu teléfono. Foodtrucks
          seguirá esos cambios.
        </Text>
      </View>
    </PageShell>
  );
}
