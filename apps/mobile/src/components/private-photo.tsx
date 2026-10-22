import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { api } from '@/lib/api';
import { useTheme } from '@/theme';

export function PrivatePhoto({ id, size = 88 }: { id: string; size?: number }) {
  const theme = useTheme();
  const [source, setSource] = useState<{ id: string; uri: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const reader = new FileReader();
    reader.onload = () => {
      if (!controller.signal.aborted && typeof reader.result === 'string')
        setSource({ id, uri: reader.result });
    };
    reader.onerror = () => {
      if (!controller.signal.aborted) setFailed(true);
    };
    void api<Blob>('/media/' + encodeURIComponent(id), { signal: controller.signal })
      .then((blob) => {
        if (!controller.signal.aborted) reader.readAsDataURL(blob);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => {
      controller.abort();
      reader.abort();
    };
  }, [id]);
  const style = { width: size, height: size, borderRadius: 18, backgroundColor: theme.selected };
  return source?.id === id ? (
    <Image
      source={{ uri: source.uri }}
      style={style}
      contentFit="cover"
      accessibilityLabel="Fotografía guardada en tu cuenta"
      cachePolicy="none"
    />
  ) : (
    <View style={{ ...style, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: theme.secondaryText, fontSize: 12 }}>
        {failed ? 'No disponible' : 'Cargando…'}
      </Text>
    </View>
  );
}
