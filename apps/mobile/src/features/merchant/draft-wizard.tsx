import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Picker, Text as NativeText } from '@expo/ui';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { AccountField, AccountForm } from '@/components/account-form';
import { ActionButton } from '@/components/action-button';
import { LocationPicker } from '@/components/location-picker';
import { PrivatePhoto } from '@/components/private-photo';
import { useExitGuard } from '@/components/use-exit-guard';
import { api, ApiError, assertSessionVersion, jsonBody, sessionVersion } from '@/lib/api';
import { useTheme } from '@/theme';
import {
  blankDraft,
  days,
  firstIncompleteStep,
  foodCategories,
  serializeDraft,
  stepIssue,
  steps,
  timeText,
  type Draft,
  type OwnerTruck,
} from './draft';

export function DraftWizard({ initial }: { initial: OwnerTruck | null }) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [document, setDocument] = useState(initial);
  const [draft, setDraft] = useState(initial?.draft ?? blankDraft);
  const [step, setStep] = useState(initial ? firstIncompleteStep(initial.draft) : 0);
  const [menu, setMenu] = useState(
    (initial?.draft.menu ?? []).map((item) => ({
      ...item,
      price: (item.priceCents / 100).toFixed(2),
    })),
  );
  const [hours, setHours] = useState(
    (initial?.draft.hours ?? []).map((slot) => ({
      key: Crypto.randomUUID(),
      day: slot.day,
      start: timeText(slot.startMinute),
      end: timeText(slot.endMinute),
    })),
  );
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsBlocked, setGpsBlocked] = useState(false);
  const [notice, setNotice] = useState('');
  const locked = document?.status === 'submitted' || document?.status === 'archived';
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const pending = useRef(false);
  const alive = useRef(true);
  const gpsRequested = useRef(false);
  const allowExit = useExitGuard(dirty, busy || gpsBusy);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && gpsRequested.current)
        void Location.getForegroundPermissionsAsync()
          .then((permission) => {
            if (alive.current) setGpsBlocked(!permission.granted && !permission.canAskAgain);
          })
          .catch(() => {
            if (alive.current)
              setNotice('No pudimos comprobar la ubicación. Puedes utilizar el mapa manual.');
          });
    });
    return () => subscription.remove();
  }, []);
  function change(changes: Partial<Draft>) {
    setDirty(true);
    setDraft((previous) => ({ ...previous, ...changes }));
  }
  async function run(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice('');
    try {
      await action();
    } catch (error) {
      if (alive.current) {
        scroll.current?.scrollTo({ y: 0, animated: false });
        setNotice(
          error instanceof ApiError && Object.keys(error.fields).length
            ? Object.values(error.fields).flat().join('\n')
            : error instanceof Error
              ? error.message
              : 'No se pudo guardar. Tus cambios siguen en esta pantalla.',
        );
      }
    } finally {
      pending.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function save(next: Draft): Promise<OwnerTruck> {
    const expected = sessionVersion();
    const saved = await api<OwnerTruck>(
      document ? '/merchant/foodtrucks/' + document.id : '/merchant/foodtrucks',
      {
        method: document ? 'PUT' : 'POST',
        body: jsonBody(document ? { version: document.version, draft: next } : next),
      },
    );
    assertSessionVersion(expected);
    if (!alive.current) throw new Error('El editor ya no está abierto.');
    setDocument(saved);
    setDraft(saved.draft);
    setDirty(false);
    return saved;
  }
  function exit() {
    allowExit(() => router.replace('/'));
  }
  function saveExit() {
    if (locked) {
      exit();
      return;
    }
    if (!document && stepIssue(draft, 0)) {
      Alert.alert(
        'Todavía no hay un borrador guardado',
        'Confirma la ubicación y dirección para guardar el primer paso.',
        [
          { text: 'Seguir editando', style: 'cancel' },
          { text: 'Descartar y salir', style: 'destructive', onPress: exit },
        ],
      );
      return;
    }
    void run(async () => {
      if (dirty || !document) await save(serializeDraft(draft, menu, hours));
      exit();
    });
  }
  function advance() {
    void run(async () => {
      const next = serializeDraft(draft, menu, hours);
      const problem = stepIssue(next, step);
      if (problem) throw new Error(problem);
      if (step === 5) {
        const missing = firstIncompleteStep(next);
        if (missing !== 5) {
          setStep(missing);
          throw new Error(stepIssue(next, missing)!);
        }
      }
      const saved = dirty || !document ? await save(next) : document;
      if (step < 5) {
        setStep(step + 1);
        return;
      }
      const result = await api<OwnerTruck>('/merchant/foodtrucks/' + saved.id + '/submit', {
        method: 'POST',
        body: jsonBody({ version: saved.version }),
      });
      if (alive.current) {
        setDocument(result);
        setNotice('Anuncio enviado a revisión. Te avisaremos cuando haya novedades.');
      }
    });
  }
  async function locate() {
    if (pending.current || gpsBusy) return;
    pending.current = true;
    const expected = sessionVersion();
    gpsRequested.current = true;
    setGpsBusy(true);
    setNotice('');
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      assertSessionVersion(expected);
      if (!alive.current) return;
      setGpsBlocked(!permission.granted && !permission.canAskAgain);
      if (!permission.granted)
        throw new Error('Puedes situar el puesto manualmente sin compartir tu ubicación.');
      if (!(await Location.hasServicesEnabledAsync()))
        throw new Error('La ubicación del teléfono está desactivada. Puedes usar el mapa manual.');
      const position = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () =>
              reject(
                new Error('No encontramos tu posición. Ajusta el punto manualmente o reintenta.'),
              ),
            15000,
          );
        }),
      ]);
      assertSessionVersion(expected);
      if (alive.current) {
        change({ longitude: position.coords.longitude, latitude: position.coords.latitude });
        setNotice('Revisa el punto y completa la dirección antes de continuar.');
      }
    } catch (error) {
      if (alive.current) {
        scroll.current?.scrollTo({ y: 0, animated: false });
        setNotice(error instanceof Error ? error.message : 'No pudimos obtener tu ubicación.');
      }
    } finally {
      clearTimeout(timeout);
      pending.current = false;
      if (alive.current) setGpsBusy(false);
    }
  }
  async function photo() {
    const expected = sessionVersion();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      exif: false,
    });
    assertSessionVersion(expected);
    if (result.canceled || !alive.current) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 8 * 1024 * 1024)
      throw new Error('Elige una fotografía de hasta 8 MB.');
    const bytes = await (await fetch(asset.uri)).blob();
    assertSessionVersion(expected);
    const media = await api<{ id: string }>('/me/media', {
      method: 'POST',
      headers: { 'Content-Type': asset.mimeType ?? 'image/jpeg' },
      body: bytes,
    });
    assertSessionVersion(expected);
    if (alive.current) change({ photos: [...draft.photos, media.id] });
  }
  function archive() {
    if (!document) return;
    Alert.alert('Archivar foodtruck', 'El anuncio dejará de estar disponible para descubrirlo.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Archivar',
        style: 'destructive',
        onPress: () =>
          void run(async () => {
            if (dirty) throw new Error('Guarda los cambios antes de archivar.');
            const saved = await api<OwnerTruck>(
              '/merchant/foodtrucks/' + document.id + '/archive',
              { method: 'POST', body: jsonBody({ version: document.version }) },
            );
            if (alive.current) setDocument(saved);
          }),
      },
    ]);
  }
  const field = (
    name: 'address' | 'locality' | 'province' | 'name' | 'description' | 'contact',
    label: string,
    maxLength: number,
    multiline = false,
  ) => (
    <AccountField
      key={name}
      label={label}
      initialValue={draft[name]}
      onChangeText={(value) => change({ [name]: value })}
      maxLength={maxLength}
      multiline={multiline}
    />
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ gestureEnabled: !busy && !gpsBusy }} />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text
            accessibilityRole="header"
            style={{ color: theme.text, flex: 1, fontSize: 16, fontWeight: '600' }}
          >
            Paso {step + 1} de 6
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={busy || gpsBusy}
            onPress={saveExit}
            style={{ minHeight: 48, justifyContent: 'center' }}
          >
            <Text style={{ color: theme.text, fontWeight: '600', textDecorationLine: 'underline' }}>
              {locked ? 'Salir' : 'Guardar y salir'}
            </Text>
          </Pressable>
        </View>
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Progreso del alta"
          accessibilityValue={{
            min: 1,
            max: 6,
            now: step + 1,
            text: `${step + 1} de 6: ${steps[step]}`,
          }}
          style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 4 }}
        >
          {steps.map((name, index) => (
            <View
              key={name}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: index <= step ? theme.accent : theme.border,
              }}
            />
          ))}
        </View>
        <Animated.ScrollView
          ref={scroll}
          key={step}
          entering={FadeIn.duration(reduced ? 100 : 180)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ padding: 24, gap: 24 }}
        >
          <Text
            accessibilityRole="header"
            style={{ fontSize: 32, fontWeight: '700', letterSpacing: -0.7, color: theme.text }}
          >
            {steps[step]}
          </Text>
          {document?.moderationReason ? (
            <Text style={{ color: theme.text }}>{document.moderationReason}</Text>
          ) : null}
          {notice !== '' && (
            <Text
              selectable
              accessibilityLiveRegion="polite"
              style={{ color: theme.text, fontSize: 16, lineHeight: 24 }}
            >
              {notice}
            </Text>
          )}
          {locked ? (
            <View style={{ gap: 24 }}>
              <Text style={{ color: theme.text, fontSize: 18 }}>
                {document?.status === 'submitted'
                  ? 'Tu anuncio está en revisión. Podrás editarlo cuando termine.'
                  : 'Este anuncio está archivado.'}
              </Text>
              {document?.status === 'submitted' && (
                <ActionButton
                  label="Archivar anuncio"
                  variant="text"
                  disabled={busy}
                  onPress={archive}
                />
              )}
            </View>
          ) : (
            <View pointerEvents={busy ? 'none' : 'auto'} style={{ gap: 24 }}>
              {step === 0 && (
                <>
                  <ActionButton
                    label={gpsBusy ? 'Buscando tu ubicación…' : 'Usar mi ubicación'}
                    loading={gpsBusy}
                    disabled={busy}
                    variant="outlined"
                    onPress={() => void locate()}
                  />
                  {gpsBlocked && (
                    <ActionButton
                      label="Abrir ajustes de ubicación"
                      variant="text"
                      onPress={() => {
                        void Linking.openSettings().catch(() =>
                          setNotice(
                            'No se pudieron abrir los ajustes. Puedes utilizar el mapa manual.',
                          ),
                        );
                      }}
                    />
                  )}
                  <LocationPicker
                    longitude={draft.longitude}
                    latitude={draft.latitude}
                    onChange={(longitude, latitude) => change({ longitude, latitude })}
                    disabled={busy || gpsBusy}
                  />
                  <AccountForm>
                    {field('address', 'Dirección del puesto', 250)}
                    {field('locality', 'Localidad', 100)}
                    {field('province', 'Provincia', 100)}
                    <NativeText textStyle={{ color: theme.text, fontSize: 16 }}>
                      Zona horaria
                    </NativeText>
                    <Picker
                      selectedValue={draft.timezone}
                      onValueChange={(timezone) => change({ timezone })}
                    >
                      <Picker.Item
                        value="Europe/Madrid"
                        label="Península, Baleares, Ceuta y Melilla"
                      />
                      <Picker.Item value="Atlantic/Canary" label="Canarias" />
                    </Picker>
                  </AccountForm>
                  <Text style={{ color: theme.secondaryText }}>
                    Este es el punto que verán los clientes cuando se apruebe tu anuncio. El GPS no
                    lo publica automáticamente.
                  </Text>
                </>
              )}
              {step === 1 && (
                <>
                  <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
                    Cuéntanos qué se cocina en tu foodtruck.
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {foodCategories.map((category) => (
                      <Pressable
                        key={category}
                        accessibilityRole="button"
                        accessibilityState={{ selected: draft.category === category }}
                        onPress={() => change({ category })}
                        style={{
                          minHeight: 64,
                          width: '47%',
                          padding: 16,
                          borderWidth: draft.category === category ? 2 : 1,
                          borderColor: draft.category === category ? theme.text : theme.border,
                          borderRadius: 16,
                          backgroundColor:
                            draft.category === category ? theme.selected : theme.surface,
                        }}
                      >
                        <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16 }}>
                          {category}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <AccountForm>
                    {field('name', 'Nombre del foodtruck', 100)}
                    {field('description', 'Describe tu propuesta', 3000, true)}
                    {field('contact', 'Contacto del negocio', 200)}
                  </AccountForm>
                </>
              )}
              {step === 2 && (
                <>
                  <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
                    Muestra tu puesto y su comida. Hasta 8 fotografías de 8 MB cada una.
                  </Text>
                  {draft.photos.map((id, index) => (
                    <View key={id} style={{ gap: 8, flexDirection: 'row', alignItems: 'center' }}>
                      <PrivatePhoto id={id} size={112} />
                      <ActionButton
                        label={`Quitar fotografía ${index + 1}`}
                        variant="text"
                        disabled={busy}
                        onPress={() =>
                          change({ photos: draft.photos.filter((photoId) => photoId !== id) })
                        }
                        style={{ flex: 1 }}
                      />
                    </View>
                  ))}
                  <ActionButton
                    label="Añadir fotografía"
                    variant="outlined"
                    disabled={busy || draft.photos.length >= 8}
                    onPress={() => void run(photo)}
                  />
                </>
              )}
              {step === 3 && (
                <>
                  {menu.map((item, index) => (
                    <View
                      key={item.id}
                      style={{
                        gap: 12,
                        paddingBottom: 24,
                        borderBottomWidth: 1,
                        borderColor: theme.border,
                      }}
                    >
                      <Text style={{ color: theme.text, fontSize: 20, fontWeight: '600' }}>
                        Plato {index + 1}
                      </Text>
                      <AccountForm>
                        {(['name', 'description', 'price', 'allergens'] as const).map((name) => (
                          <AccountField
                            key={name}
                            label={
                              {
                                name: 'Nombre del plato',
                                description: 'Descripción',
                                price: 'Precio (€)',
                                allergens: 'Alérgenos e información alimentaria',
                              }[name]
                            }
                            initialValue={item[name]}
                            maxLength={name === 'price' ? 9 : name === 'name' ? 100 : 500}
                            keyboardType={name === 'price' ? 'decimal-pad' : 'default'}
                            onChangeText={(value) => {
                              setDirty(true);
                              setMenu((items) =>
                                items.map((existing) =>
                                  existing.id === item.id
                                    ? { ...existing, [name]: value }
                                    : existing,
                                ),
                              );
                            }}
                          />
                        ))}
                      </AccountForm>
                      <ActionButton
                        label={`Quitar plato ${index + 1}`}
                        variant="text"
                        onPress={() => {
                          setDirty(true);
                          setMenu((items) => items.filter((existing) => existing.id !== item.id));
                        }}
                      />
                    </View>
                  ))}
                  <ActionButton
                    label="Añadir plato"
                    variant="outlined"
                    disabled={menu.length >= 100}
                    onPress={() => {
                      setDirty(true);
                      setMenu((items) => [
                        ...items,
                        {
                          id: Crypto.randomUUID(),
                          name: '',
                          description: '',
                          priceCents: 0,
                          price: '',
                          allergens: '',
                        },
                      ]);
                    }}
                  />
                </>
              )}
              {step === 4 && (
                <>
                  <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
                    Indica cada franja de apertura. Para un cierre a medianoche, utiliza 24:00.
                  </Text>
                  {hours.map((slot, index) => (
                    <View key={slot.key} style={{ gap: 12 }}>
                      <AccountForm>
                        <Picker
                          selectedValue={slot.day}
                          onValueChange={(day) => {
                            setDirty(true);
                            setHours((items) =>
                              items.map((item) =>
                                item.key === slot.key ? { ...item, day } : item,
                              ),
                            );
                          }}
                        >
                          {days.map((name, day) => (
                            <Picker.Item key={name} value={day + 1} label={name} />
                          ))}
                        </Picker>
                        {(['start', 'end'] as const).map((name) => (
                          <AccountField
                            key={name}
                            label={name === 'start' ? 'Apertura (HH:MM)' : 'Cierre (HH:MM)'}
                            initialValue={slot[name]}
                            maxLength={5}
                            keyboardType="numbers-and-punctuation"
                            onChangeText={(value) => {
                              setDirty(true);
                              setHours((items) =>
                                items.map((item) =>
                                  item.key === slot.key ? { ...item, [name]: value } : item,
                                ),
                              );
                            }}
                          />
                        ))}
                      </AccountForm>
                      <ActionButton
                        label={`Quitar franja ${index + 1}`}
                        variant="text"
                        onPress={() => {
                          setDirty(true);
                          setHours((items) => items.filter((item) => item.key !== slot.key));
                        }}
                      />
                    </View>
                  ))}
                  <ActionButton
                    label="Añadir franja"
                    variant="outlined"
                    disabled={hours.length >= 70}
                    onPress={() => {
                      setDirty(true);
                      setHours((items) => [
                        ...items,
                        { key: Crypto.randomUUID(), day: 1, start: '09:00', end: '18:00' },
                      ]);
                    }}
                  />
                </>
              )}
              {step === 5 && (
                <>
                  {draft.photos[0] && <PrivatePhoto id={draft.photos[0]} size={240} />}
                  <Text style={{ fontSize: 24, color: theme.text, fontWeight: '600' }}>
                    {draft.name}
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 16 }}>{draft.description}</Text>
                  <Text style={{ color: theme.secondaryText }}>
                    {draft.category} · {draft.address}, {draft.locality}, {draft.province}
                  </Text>
                  <Text style={{ color: theme.text }}>
                    {draft.photos.length} fotos · {menu.length} platos · {hours.length} franjas
                  </Text>
                  {steps.slice(0, 5).map((name, index) => (
                    <ActionButton
                      key={name}
                      variant="text"
                      label={`Revisar ${name.toLowerCase()}`}
                      onPress={() => setStep(index)}
                    />
                  ))}
                  <Text style={{ color: theme.secondaryText }}>
                    La revisión comprobará tu anuncio antes de publicarlo. Si ya existe una versión
                    publicada, seguirá visible hasta aprobar los cambios.
                  </Text>
                  {document && (
                    <ActionButton label="Archivar anuncio" variant="text" onPress={archive} />
                  )}
                </>
              )}
            </View>
          )}
        </Animated.ScrollView>
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            flexDirection: 'row',
            gap: 16,
          }}
        >
          <ActionButton
            label="Atrás"
            variant="text"
            disabled={busy || gpsBusy || step === 0}
            onPress={() => {
              setNotice('');
              setStep(step - 1);
            }}
          />
          {locked ? (
            <ActionButton label="Volver a mis foodtrucks" onPress={exit} style={{ flex: 1 }} />
          ) : (
            <ActionButton
              label={step === 5 ? 'Enviar a revisión' : 'Continuar'}
              loading={busy}
              disabled={gpsBusy}
              onPress={advance}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
