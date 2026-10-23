import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PageShell } from '@/components/page-shell';
import { useTheme } from '@/theme';

const questions = [
  {
    title: '¿Cómo encuentro mi próxima parada?',
    answer:
      'Busca por nombre, tipo de comida o zona. También puedes elegir una categoría y filtrar por puestos abiertos o precio inicial.',
  },
  {
    title: '¿Dónde están mis favoritos?',
    answer:
      'Toca el corazón de una tarjeta para guardarla en tu cuenta. Puedes ver tus favoritos desde el corazón de Explorar o desde Perfil. Necesitas iniciar sesión.',
  },
  {
    title: '¿Puedo hacer un pedido?',
    answer:
      'Puedes explorar los anuncios publicados y consultar sus cartas. Los pedidos y pagos estarán disponibles en una siguiente fase. No se realiza ningún cobro en esta versión DEV.',
  },
  {
    title: '¿Necesito compartir mi ubicación?',
    answer:
      'No. Puedes explorar las tarjetas y buscar una zona sin compartir tu ubicación. Si el mapa no está disponible, la lista sigue funcionando.',
  },
];

export default function HelpScreen() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <PageShell title="Recibe ayuda">
      <Text style={{ color: theme.secondaryText, fontSize: 17, lineHeight: 26 }}>
        Todo lo que necesitas para empezar a explorar.
      </Text>
      <View>
        {questions.map((question, index) => (
          <View
            key={question.title}
            style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: theme.border }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={question.title}
              accessibilityState={{ expanded: expanded === index }}
              onPress={() => setExpanded(expanded === index ? null : index)}
              style={{
                minHeight: 64,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                paddingVertical: 12,
              }}
            >
              <Icon name="help-outline" color={theme.text} />
              <Text style={{ flex: 1, color: theme.text, fontSize: 17, lineHeight: 25 }}>
                {question.title}
              </Text>
              <Icon
                name={expanded === index ? 'expand-less' : 'expand-more'}
                color={theme.secondaryText}
              />
            </Pressable>
            {expanded === index && (
              <Text
                style={{
                  color: theme.secondaryText,
                  fontSize: 16,
                  lineHeight: 25,
                  paddingBottom: 18,
                }}
              >
                {question.answer}
              </Text>
            )}
          </View>
        ))}
      </View>
    </PageShell>
  );
}
