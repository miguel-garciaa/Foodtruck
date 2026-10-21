import { BottomSheet, Button, Column, Host, ScrollView, Switch, Text } from '@expo/ui';
import { useWindowDimensions } from 'react-native';

import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const { filters, setFilters, results, clearFilters } = useDiscovery();
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 48, 600);
  if (!open) return null;

  return (
    <Host seedColor={theme.accent}>
      <BottomSheet
        isPresented={open}
        onDismiss={onClose}
        snapPoints={['full']}
        containerColor={theme.surface}
        contentPadding={24}
      >
        <ScrollView style={{ width: contentWidth, height: height * 0.78 }}>
          <Column spacing={24} style={{ width: contentWidth, paddingBottom: 24 }}>
            <Text textStyle={{ fontSize: 24, fontWeight: '700', color: theme.text }}>
              A tu gusto
            </Text>
            <Text textStyle={{ fontSize: 16, color: theme.secondaryText }}>
              Ajusta los resultados de esta demostración.
            </Text>
            <Switch
              label="Solo abiertos"
              value={filters.openOnly}
              onValueChange={(openOnly) => setFilters((previous) => ({ ...previous, openOnly }))}
            />
            <Switch
              label="Platos desde 6 € o menos"
              value={filters.maxPriceCents !== null}
              onValueChange={(enabled) =>
                setFilters((previous) => ({ ...previous, maxPriceCents: enabled ? 600 : null }))
              }
            />
            <Button
              label={`Ver ${results.length} resultados`}
              onPress={onClose}
              style={{ width: contentWidth }}
            />
            <Button label="Restablecer filtros" variant="text" onPress={clearFilters} />
          </Column>
        </ScrollView>
      </BottomSheet>
    </Host>
  );
}
