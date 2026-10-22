import { Button, Column, Picker, Text as NativeText } from '@expo/ui';
import { router, useLocalSearchParams } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import type { components } from '@/generated/api';
import { AccountField, AccountForm } from '@/components/account-form';
import { PageShell } from '@/components/page-shell';
import { useAccount } from '@/features/account/account-context';
import { listingStatus } from '@/features/merchant/owner-home';
import { parseEuros } from '@/features/discovery/remote';
import { api, ApiError, assertSessionVersion, jsonBody, sessionVersion } from '@/lib/api';
import { useTheme } from '@/theme';
import { PrivatePhoto } from '@/components/private-photo';

type Draft = components['schemas']['Draft'];
type OwnerTruck = components['schemas']['OwnerTruck'];
const categories: Draft['category'][] = ['Hamburguesas', 'Tacos', 'Vegetariano', 'Otros'];
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
function timeText(minutes: number) {
  return (
    String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0')
  );
}
function minuteValue(value: string) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) && value !== '24:00')
    throw new Error('Introduce cada hora con formato HH:MM.');
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}
const blank: Draft = {
  name: '',
  description: '',
  category: 'Otros',
  contact: '',
  locality: '',
  province: '',
  address: '',
  longitude: 0,
  latitude: 0,
  timezone: 'Europe/Madrid',
  photos: [],
  hours: [],
  menu: [],
};

export default function OwnerTruckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, loading } = useAccount();
  const userId = profile?.id;
  const theme = useTheme();
  const [document, setDocument] = useState<OwnerTruck | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!userId || id === 'new') return;
    const controller = new AbortController();
    void api<OwnerTruck>('/merchant/foodtrucks/' + encodeURIComponent(id), {
      signal: controller.signal,
    })
      .then((next) => {
        setDocument(next);
        setError('');
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            'No se puede abrir este anuncio. Comprueba la conexión y que pertenece a tu cuenta.',
          );
      });
    return () => controller.abort();
  }, [id, userId, revision]);
  return (
    <PageShell title={id === 'new' ? 'Tu nuevo foodtruck' : document?.draft.name || 'Tu anuncio'}>
      {loading ? (
        <ActivityIndicator color={theme.accent} />
      ) : !profile ? (
        <AccountForm>
          <Button label="Iniciar sesión" onPress={() => router.replace('/auth')} />
        </AccountForm>
      ) : !profile.emailVerified ? (
        <AccountForm>
          <NativeText>Verifica tu correo para gestionar anuncios.</NativeText>
          <Button label="Ir a mi cuenta" onPress={() => router.push('/account')} />
        </AccountForm>
      ) : id === 'new' || document ? (
        <DraftEditor
          key={`${profile.id}:${id}:${document?.version ?? 0}`}
          value={id === 'new' ? null : document}
          onSaved={setDocument}
        />
      ) : error ? (
        <>
          <Text style={{ color: theme.text }}>{error}</Text>
          <AccountForm>
            <Button label="Reintentar" onPress={() => setRevision((value) => value + 1)} />
          </AccountForm>
        </>
      ) : (
        <ActivityIndicator color={theme.accent} />
      )}
    </PageShell>
  );
}

function DraftEditor({
  value,
  onSaved,
}: {
  value: OwnerTruck | null;
  onSaved: (value: OwnerTruck) => void;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState(value?.draft ?? blank);
  const [longitude, setLongitude] = useState(value ? String(value.draft.longitude) : '');
  const [latitude, setLatitude] = useState(value ? String(value.draft.latitude) : '');
  const [menu, setMenu] = useState(
    (value?.draft.menu ?? []).map((item) => ({
      ...item,
      price: (item.priceCents / 100).toFixed(2),
    })),
  );
  const [hours, setHours] = useState(
    (value?.draft.hours ?? []).map((slot) => ({
      ...slot,
      key: Crypto.randomUUID(),
      start: timeText(slot.startMinute),
      end: timeText(slot.endMinute),
    })),
  );
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const locked = value?.status === 'submitted' || value?.status === 'archived';
  function change(changes: Partial<Draft>) {
    setDirty(true);
    setDraft((previous) => ({ ...previous, ...changes }));
  }
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setNotice('');
    try {
      await action();
    } catch (error) {
      setNotice(
        error instanceof ApiError && Object.keys(error.fields).length
          ? Object.values(error.fields).flat().join('\n')
          : error instanceof Error
            ? error.message
            : 'No se pudo guardar.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!longitude.trim() || !latitude.trim())
      throw new Error('Indica la longitud y latitud del puesto.');
    const lon = Number(longitude.replace(',', '.'));
    const lat = Number(latitude.replace(',', '.'));
    if (!Number.isFinite(lon) || !Number.isFinite(lat))
      throw new Error('Comprueba las coordenadas.');
    const next: Draft = {
      ...draft,
      longitude: lon,
      latitude: lat,
      menu: menu.map(({ price, ...item }) => {
        const cents = parseEuros(price);
        if (cents == null) throw new Error('Indica el precio de cada plato.');
        return { ...item, priceCents: cents };
      }),
      hours: hours.map((slot) => ({
        day: slot.day,
        startMinute: minuteValue(slot.start),
        endMinute: minuteValue(slot.end),
      })),
    };
    const saved = await api<OwnerTruck>(
      value ? '/merchant/foodtrucks/' + value.id : '/merchant/foodtrucks',
      {
        method: value ? 'PUT' : 'POST',
        body: jsonBody(value ? { version: value.version, draft: next } : next),
      },
    );
    if (!value) router.replace({ pathname: '/merchant/[id]', params: { id: saved.id } });
    onSaved(saved);
  }
  async function photo() {
    const expected = sessionVersion();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      exif: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 8 * 1024 * 1024)
      throw new Error('Elige una foto de hasta 8 MB.');
    const bytes = await (await fetch(asset.uri)).blob();
    assertSessionVersion(expected);
    const media = await api<components['schemas']['Media']>('/me/media', {
      method: 'POST',
      headers: { 'Content-Type': asset.mimeType ?? 'image/jpeg' },
      body: bytes,
    });
    change({ photos: [...draft.photos, media.id] });
  }
  async function transition(action: 'submit' | 'archive') {
    if (!value) return;
    if (dirty) throw new Error('Guarda los cambios antes de continuar.');
    onSaved(
      await api<OwnerTruck>('/merchant/foodtrucks/' + value.id + '/' + action, {
        method: 'POST',
        body: jsonBody({ version: value.version }),
      }),
    );
  }
  const labelStyle = { color: theme.text, fontSize: 20, fontWeight: '600' as const };
  return (
    <View style={{ gap: 24 }}>
      {draft.photos.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {draft.photos.map((id) => (
            <PrivatePhoto key={id} id={id} />
          ))}
        </View>
      )}
      {value && (
        <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
          {listingStatus[value.status]}
          {value.published && value.status !== 'archived' ? ' · Hay una versión publicada' : ''}
        </Text>
      )}
      {value?.moderationReason && (
        <Text style={{ color: theme.text, fontSize: 16 }}>{value.moderationReason}</Text>
      )}
      {locked ? (
        <Text style={{ color: theme.text }}>
          {value?.status === 'submitted'
            ? 'El anuncio está en revisión. Podrás editarlo cuando termine.'
            : 'Este anuncio está archivado.'}
        </Text>
      ) : (
        <>
          <AccountForm>
            {(['name', 'description', 'contact', 'locality', 'province', 'address'] as const).map(
              (field) => (
                <AccountField
                  key={field}
                  label={
                    {
                      name: 'Nombre del foodtruck',
                      description: 'Descripción',
                      contact: 'Contacto comercial público',
                      locality: 'Localidad',
                      province: 'Provincia',
                      address: 'Dirección del puesto',
                    }[field]
                  }
                  initialValue={draft[field]}
                  editable={!busy}
                  multiline={field === 'description'}
                  maxLength={
                    field === 'description'
                      ? 3000
                      : field === 'address'
                        ? 250
                        : field === 'contact'
                          ? 200
                          : 100
                  }
                  onChangeText={(text) => change({ [field]: text })}
                />
              ),
            )}
            <NativeText textStyle={labelStyle}>Categoría</NativeText>
            <Picker
              selectedValue={draft.category}
              onValueChange={(category) => change({ category })}
            >
              {categories.map((category) => (
                <Picker.Item key={category} value={category} label={category} />
              ))}
            </Picker>
            <NativeText textStyle={labelStyle}>Ubicación del puesto</NativeText>
            <AccountField
              label="Longitud"
              initialValue={longitude}
              keyboardType="numbers-and-punctuation"
              onChangeText={(text) => {
                setLongitude(text);
                setDirty(true);
              }}
            />
            <AccountField
              label="Latitud"
              initialValue={latitude}
              keyboardType="numbers-and-punctuation"
              onChangeText={(text) => {
                setLatitude(text);
                setDirty(true);
              }}
            />
            <NativeText textStyle={labelStyle}>Zona horaria</NativeText>
            <Picker
              selectedValue={draft.timezone}
              onValueChange={(timezone) => change({ timezone })}
            >
              <Picker.Item value="Europe/Madrid" label="Península, Baleares, Ceuta y Melilla" />
              <Picker.Item value="Atlantic/Canary" label="Canarias" />
            </Picker>
            <NativeText
              textStyle={labelStyle}
            >{`Fotografías (${draft.photos.length}/8)`}</NativeText>
            {draft.photos.map((id, index) => (
              <Button
                key={id}
                variant="outlined"
                label={`Quitar fotografía ${index + 1}`}
                disabled={busy}
                onPress={() => change({ photos: draft.photos.filter((photo) => photo !== id) })}
              />
            ))}
            <Button
              label="Añadir fotografía"
              disabled={busy || draft.photos.length >= 8}
              onPress={() => void run(photo)}
            />
            <NativeText textStyle={labelStyle}>Horarios</NativeText>
            <NativeText textStyle={{ color: theme.secondaryText }}>
              Usa HH:MM. Para un turno que pasa de medianoche, añade dos franjas en días
              consecutivos.
            </NativeText>
            {hours.map((slot, index) => (
              <Column key={slot.key} spacing={10}>
                <Picker
                  selectedValue={slot.day}
                  onValueChange={(day) => {
                    setHours((previous) =>
                      previous.map((item, i) => (i === index ? { ...item, day } : item)),
                    );
                    setDirty(true);
                  }}
                >
                  {days.map((day, i) => (
                    <Picker.Item key={day} label={day} value={i + 1} />
                  ))}
                </Picker>
                <AccountField
                  label="Apertura (HH:MM)"
                  initialValue={slot.start}
                  maxLength={5}
                  onChangeText={(start) => {
                    setHours((previous) =>
                      previous.map((item, i) => (i === index ? { ...item, start } : item)),
                    );
                    setDirty(true);
                  }}
                />
                <AccountField
                  label="Cierre (HH:MM)"
                  initialValue={slot.end}
                  maxLength={5}
                  onChangeText={(end) => {
                    setHours((previous) =>
                      previous.map((item, i) => (i === index ? { ...item, end } : item)),
                    );
                    setDirty(true);
                  }}
                />
                <Button
                  variant="text"
                  label="Quitar franja"
                  onPress={() => {
                    setHours((previous) => previous.filter((_, i) => i !== index));
                    setDirty(true);
                  }}
                />
              </Column>
            ))}
            <Button
              label="Añadir franja"
              disabled={busy || hours.length >= 70}
              onPress={() => {
                setHours((previous) => [
                  ...previous,
                  {
                    key: Crypto.randomUUID(),
                    day: 1,
                    start: '',
                    end: '',
                    startMinute: 0,
                    endMinute: 0,
                  },
                ]);
                setDirty(true);
              }}
            />
            <NativeText textStyle={labelStyle}>Carta</NativeText>
            {menu.map((item, index) => (
              <Column key={item.id} spacing={12}>
                {(['name', 'description', 'price', 'allergens'] as const).map((field) => (
                  <AccountField
                    key={field}
                    label={
                      {
                        name: 'Nombre del plato',
                        description: 'Descripción del plato',
                        price: 'Precio (€)',
                        allergens: 'Alérgenos e información alimentaria',
                      }[field]
                    }
                    initialValue={item[field]}
                    keyboardType={field === 'price' ? 'decimal-pad' : 'default'}
                    maxLength={field === 'price' ? 9 : field === 'name' ? 100 : 500}
                    onChangeText={(text) => {
                      setMenu((previous) =>
                        previous.map((entry, i) =>
                          i === index ? { ...entry, [field]: text } : entry,
                        ),
                      );
                      setDirty(true);
                    }}
                  />
                ))}
                <Button
                  variant="text"
                  label="Quitar plato"
                  onPress={() => {
                    setMenu((previous) => previous.filter((_, i) => i !== index));
                    setDirty(true);
                  }}
                />
              </Column>
            ))}
            <Button
              label="Añadir plato"
              disabled={busy || menu.length >= 100}
              onPress={() => {
                setMenu((previous) => [
                  ...previous,
                  {
                    id: Crypto.randomUUID(),
                    name: '',
                    description: '',
                    price: '',
                    priceCents: 0,
                    allergens: '',
                  },
                ]);
                setDirty(true);
              }}
            />
            <Button
              label={busy ? 'Guardando…' : 'Guardar borrador'}
              disabled={busy}
              onPress={() => void run(save)}
            />
            {value && (
              <Button
                variant="outlined"
                label="Enviar a revisión"
                disabled={busy || dirty}
                onPress={() => void run(() => transition('submit'))}
              />
            )}
          </AccountForm>
        </>
      )}
      {value && value.status !== 'archived' && (
        <AccountForm>
          <Button
            variant="text"
            label="Archivar anuncio"
            disabled={busy || dirty}
            onPress={() =>
              Alert.alert('Archivar anuncio', 'El anuncio dejará de aparecer en las búsquedas.', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Archivar',
                  style: 'destructive',
                  onPress: () => void run(() => transition('archive')),
                },
              ])
            }
          />
        </AccountForm>
      )}
      {notice !== '' && (
        <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 16 }}>
          {notice}
        </Text>
      )}
    </View>
  );
}
