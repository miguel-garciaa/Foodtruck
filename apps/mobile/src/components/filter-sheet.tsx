import { BottomSheet, Picker, RNHostView, Switch, Text as NativeText } from '@expo/ui';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { AccountField, AccountForm } from './account-form';
import { ActionButton } from './action-button';
import { Icon } from './icon';
import { categories } from '@/features/discovery/catalog';
import { initialFilters } from '@/features/discovery/filters';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { parseEuros } from '@/features/discovery/remote';
import { useTheme } from '@/theme';

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const { filters, applyFilters } = useDiscovery();
  const [draft, setDraft] = useState(filters);
  const [minimum, setMinimum] = useState(
    filters.minPriceCents == null ? '' : String(filters.minPriceCents / 100),
  );
  const [maximum, setMaximum] = useState(
    filters.maxPriceCents == null ? '' : String(filters.maxPriceCents / 100),
  );
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const { width, height, fontScale } = useWindowDimensions();
  function apply() {
    try {
      const minPriceCents = parseEuros(minimum);
      const maxPriceCents = parseEuros(maximum);
      if (minPriceCents != null && maxPriceCents != null && minPriceCents > maxPriceCents)
        throw new Error('El precio mínimo no puede superar al máximo.');
      applyFilters({ ...draft, minPriceCents, maxPriceCents });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Comprueba los precios.');
    }
  }
  return (
    <BottomSheet
      isPresented={open}
      onDismiss={onClose}
      snapPoints={['full']}
      containerColor={theme.surface}
      contentPadding={0}
    >
      <RNHostView key={fontScale} matchContents>
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
          style={{
            width: Math.min(width, 640),
            height: height * 0.85,
            backgroundColor: theme.surface,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
              borderBottomWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text
              accessibilityRole="header"
              style={{ fontSize: 22, fontWeight: '700', flex: 1, color: theme.text }}
            >
              A tu gusto
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar filtros sin aplicar"
              onPress={onClose}
              style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="close" color={theme.text} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 24, gap: 20 }}
          >
            <Text style={{ fontSize: 15, lineHeight: 22, color: theme.secondaryText }}>
              Combinaremos todos tus filtros. El precio compara el plato más económico de cada
              carta, incluidos ambos límites.
            </Text>
            <AccountForm key={revision}>
              <NativeText textStyle={{ color: theme.text, fontSize: 18, fontWeight: '600' }}>
                Tipo de comida
              </NativeText>
              <Picker
                selectedValue={draft.category}
                onValueChange={(category) => setDraft((previous) => ({ ...previous, category }))}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category}
                    value={category}
                    label={category === 'Todo' ? 'Todos los tipos de comida' : category}
                  />
                ))}
              </Picker>
              <AccountField
                label="Desde (€)"
                initialValue={minimum}
                keyboardType="decimal-pad"
                onChangeText={setMinimum}
                maxLength={9}
              />
              <AccountField
                label="Hasta (€)"
                initialValue={maximum}
                keyboardType="decimal-pad"
                onChangeText={setMaximum}
                maxLength={9}
              />
              <AccountField
                label="Localidad"
                initialValue={draft.locality}
                onChangeText={(locality) => setDraft((previous) => ({ ...previous, locality }))}
                maxLength={100}
              />
              <AccountField
                label="Provincia (opcional)"
                initialValue={draft.province}
                onChangeText={(province) => setDraft((previous) => ({ ...previous, province }))}
                maxLength={100}
              />
              <NativeText textStyle={{ color: theme.text, fontSize: 18, fontWeight: '600' }}>
                Valoración mínima
              </NativeText>
              <Picker
                selectedValue={draft.minRating ?? 0}
                onValueChange={(minRating) => setDraft((previous) => ({ ...previous, minRating }))}
              >
                {([0, 4, 4.5] as const).map((value) => (
                  <Picker.Item
                    key={value}
                    label={
                      value === 0
                        ? 'Cualquiera, incluidos sin valoraciones'
                        : `${value.toLocaleString('es-ES')} estrellas o más`
                    }
                    value={value}
                  />
                ))}
              </Picker>
              <Switch
                label="Solo abiertos"
                value={draft.openOnly}
                onValueChange={(openOnly) => setDraft((previous) => ({ ...previous, openOnly }))}
              />
            </AccountForm>
            {error !== '' && (
              <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 16 }}>
                {error}
              </Text>
            )}
          </ScrollView>
          <View style={{ padding: 16, borderTopWidth: 1, borderColor: theme.border, gap: 8 }}>
            <ActionButton label="Aplicar filtros" onPress={apply} />
            <ActionButton
              label="Restablecer"
              variant="text"
              onPress={() => {
                setDraft(initialFilters);
                setMinimum('');
                setMaximum('');
                setError('');
                setRevision((value) => value + 1);
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </RNHostView>
    </BottomSheet>
  );
}
