import { BottomSheet, Button, Column, Host, Picker, ScrollView, Switch, Text } from '@expo/ui';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AccountField } from './account-form';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { parseEuros } from '@/features/discovery/remote';
import { useTheme } from '@/theme';

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return open ? <FilterContent onClose={onClose} /> : null;
}
function FilterContent({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const { filters, setFilters, clearFilters } = useDiscovery();
  const [draft, setDraft] = useState(filters);
  const [minimum, setMinimum] = useState(
    filters.minPriceCents == null ? '' : String(filters.minPriceCents / 100),
  );
  const [maximum, setMaximum] = useState(
    filters.maxPriceCents == null ? '' : String(filters.maxPriceCents / 100),
  );
  const [error, setError] = useState('');
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 48, 600);
  function apply() {
    try {
      const minPriceCents = parseEuros(minimum);
      const maxPriceCents = parseEuros(maximum);
      if (minPriceCents != null && maxPriceCents != null && minPriceCents > maxPriceCents)
        throw new Error('El precio mínimo no puede superar al máximo.');
      setFilters({ ...draft, minPriceCents, maxPriceCents });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Comprueba los precios.');
    }
  }
  return (
    <Host seedColor={theme.accent}>
      <BottomSheet
        isPresented
        onDismiss={onClose}
        snapPoints={['full']}
        containerColor={theme.surface}
        contentPadding={24}
      >
        <ScrollView style={{ width: contentWidth, height: height * 0.78 }}>
          <Column spacing={20} style={{ width: contentWidth, paddingBottom: 32 }}>
            <Text textStyle={{ fontSize: 24, fontWeight: '700', color: theme.text }}>
              A tu gusto
            </Text>
            <Text textStyle={{ fontSize: 15, color: theme.secondaryText }}>
              Se aplican todos los filtros elegidos. El precio compara el plato más económico de
              cada carta e incluye ambos límites.
            </Text>
            <Switch
              label="Solo abiertos"
              value={draft.openOnly}
              onValueChange={(openOnly) => setDraft((previous) => ({ ...previous, openOnly }))}
            />
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
              label="Provincia"
              initialValue={draft.province}
              onChangeText={(province) => setDraft((previous) => ({ ...previous, province }))}
              maxLength={100}
            />
            <Text textStyle={{ color: theme.text, fontSize: 16 }}>Valoración mínima</Text>
            <Picker
              selectedValue={draft.minRating ?? 0}
              onValueChange={(minRating) => setDraft((previous) => ({ ...previous, minRating }))}
            >
              {[0, 4, 4.5].map((value) => (
                <Picker.Item
                  key={value}
                  label={
                    value === 0
                      ? 'Cualquiera, incluidos sin valoraciones'
                      : `${value.toLocaleString('es-ES')} estrellas`
                  }
                  value={value}
                />
              ))}
            </Picker>
            {error !== '' && <Text textStyle={{ color: theme.accent, fontSize: 16 }}>{error}</Text>}
            <Button label="Aplicar filtros" onPress={apply} />
            <Button
              label="Restablecer filtros"
              variant="text"
              onPress={() => {
                clearFilters();
                onClose();
              }}
            />
          </Column>
        </ScrollView>
      </BottomSheet>
    </Host>
  );
}
