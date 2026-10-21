import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { categories } from '@/features/discovery/catalog';
import { useDiscovery } from '@/features/discovery/discovery-context';
import { useTheme } from '@/theme';
import { FilterSheet } from './filter-sheet';
import { Icon, type IconName } from './icon';

const categoryIcons: IconName[] = ['restaurant', 'lunch-dining', 'local-dining', 'eco'];

export function SearchHeader() {
  const theme = useTheme();
  const { filters, setFilters } = useDiscovery();
  const [filterOpen, setFilterOpen] = useState(false);
  const active = filters.openOnly || filters.maxPriceCents !== null;

  return (
    <View style={{ backgroundColor: theme.background, paddingTop: 12, gap: 18 }}>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 24, alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            minHeight: 62,
            backgroundColor: theme.surface,
            borderRadius: 32,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: theme.border,
            boxShadow: '0 5px 20px rgba(0,0,0,0.07)',
          }}
        >
          <Icon name="search" color={theme.text} />
          <TextInput
            accessibilityLabel="Buscar foodtrucks, comida o zona"
            placeholder="¿Qué te apetece?"
            placeholderTextColor={theme.secondaryText}
            value={filters.query}
            onChangeText={(query) => setFilters((previous) => ({ ...previous, query }))}
            returnKeyType="search"
            autoCorrect={false}
            maxLength={100}
            style={{ flex: 1, minHeight: 48, fontSize: 16, color: theme.text, paddingVertical: 8 }}
          />
          {filters.query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Borrar búsqueda"
              onPress={() => setFilters((previous) => ({ ...previous, query: '' }))}
              hitSlop={12}
            >
              <Icon name="close" color={theme.secondaryText} size={20} />
            </Pressable>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir filtros"
          accessibilityState={{ expanded: filterOpen }}
          onPress={() => setFilterOpen(true)}
          style={{
            minHeight: 48,
            minWidth: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: active ? theme.softAccent : theme.surface,
            borderWidth: 1,
            borderColor: active ? theme.accent : theme.border,
          }}
        >
          <Icon name="tune" color={active ? theme.accent : theme.text} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 10, paddingBottom: 14 }}
        keyboardShouldPersistTaps="handled"
      >
        {categories.map((category, index) => {
          const selected = filters.category === category;
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityLabel={category}
              accessibilityState={{ selected }}
              onPress={() => setFilters((previous) => ({ ...previous, category }))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 17,
                minHeight: 48,
                borderRadius: 24,
                backgroundColor: selected ? theme.selected : theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Icon
                name={categoryIcons[index]}
                size={21}
                color={selected ? theme.accent : theme.secondaryText}
              />
              <Text
                style={{ fontSize: 14, fontWeight: selected ? '600' : '400', color: theme.text }}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingBottom: 16,
          gap: 12,
        }}
      >
        <Text style={{ flex: 1, fontSize: 12, color: theme.secondaryText }}>
          Datos de demostración · Recogida en el puesto
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver favoritos"
          onPress={() => router.push('/favorites')}
          hitSlop={12}
        >
          <Icon name="favorite-border" size={20} color={theme.text} />
        </Pressable>
      </View>
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
    </View>
  );
}
