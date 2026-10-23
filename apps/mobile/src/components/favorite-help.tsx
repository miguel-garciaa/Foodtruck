import { BottomSheet, RNHostView } from '@expo/ui';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { ActionButton } from './action-button';
import { Icon } from './icon';
import { useTheme } from '@/theme';

export function FavoriteHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const { width, height, fontScale } = useWindowDimensions();
  return (
    <BottomSheet
      isPresented={open}
      onDismiss={onClose}
      snapPoints={['full']}
      containerColor={theme.surface}
      contentPadding={0}
    >
      {/* Recreate the modal's RN layout root when Android changes font metrics. */}
      <RNHostView key={fontScale} matchContents>
        <View
          style={{
            width: Math.min(width, 640),
            height: height * 0.85,
            backgroundColor: theme.surface,
          }}
        >
          <View style={{ alignItems: 'flex-end', paddingHorizontal: 16 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar explicación de favoritos"
              onPress={onClose}
              style={{
                minWidth: 48,
                minHeight: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="close" color={theme.text} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 32,
              gap: 28,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 112,
                height: 112,
                borderRadius: 22,
                borderWidth: 3,
                borderColor: theme.surface,
                boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
              }}
            >
              <Image
                source={require('../../assets/foodtrucks/orange-truck.png')}
                style={{ width: '100%', height: '100%', borderRadius: 19 }}
                contentFit="cover"
                accessibilityLabel="Foodtruck ilustrativo guardado en favoritos"
              />
              <View style={{ position: 'absolute', right: 10, top: 10 }}>
                <Icon name="favorite" size={20} color={theme.accent} />
              </View>
            </View>
            <Text
              accessibilityRole="header"
              style={{
                color: theme.text,
                fontWeight: '700',
                fontSize: 28,
                letterSpacing: -0.5,
                textAlign: 'center',
              }}
            >
              Tus foodtrucks favoritos, en un mismo lugar
            </Text>
            <Text style={{ color: theme.text, fontSize: 17, lineHeight: 26, textAlign: 'center' }}>
              Pulsa el corazón mientras exploras para guardar un foodtruck. Inicia sesión para
              encontrar tus paradas guardadas en tu cuenta.
            </Text>
          </ScrollView>
          <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
            <ActionButton label="Entendido" variant="neutral" onPress={onClose} />
          </View>
        </View>
      </RNHostView>
    </BottomSheet>
  );
}
