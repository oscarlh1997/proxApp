import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, errorMessage } from '../api/client';
import { useMe } from '../store';
import { C, T } from '../theme';
import { RelationshipStatus, SocialLink } from '../types';
import { ScreenProps } from '../navigation/types';
import { normalizeUrl, RELATIONSHIP_LABELS } from '../utils/format';
import { Field } from '../components/Field';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { PLATFORMS, platformInfo } from '../components/Social';
import { ErrorBanner, Loading } from '../components/States';

const INTERESTS = [
  'Café', 'Música', 'Viajes', 'Cocina', 'Cine', 'Lectura', 'Fotografía', 'Fútbol', 'Running', 'Ciclismo',
  'Yoga', 'Gaming', 'Programación', 'Diseño', 'Emprendimiento', 'Arte', 'Baile', 'Idiomas', 'Montaña', 'Series',
];
const STATUSES = Object.keys(RELATIONSHIP_LABELS) as RelationshipStatus[];

export default function EditProfileScreen({ navigation }: ScreenProps<'EditProfile'>) {
  const { me, setMe } = useMe();
  const [displayName, setDisplayName] = useState(me?.displayName ?? '');
  const [bio, setBio] = useState(me?.bio ?? '');
  const [status, setStatus] = useState<RelationshipStatus>(me?.relationshipStatus ?? 'no_especificado');
  const [interests, setInterests] = useState<string[]>(me?.interests ?? []);
  const [custom, setCustom] = useState('');
  const [links, setLinks] = useState<SocialLink[]>(me?.socialLinks ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!me) return <Loading />;

  // Incluye los intereses propios que no están en la lista sugerida
  const options = [...INTERESTS, ...interests.filter((i) => !INTERESTS.includes(i))];
  const toggle = (t: string) => setInterests((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const addCustom = () => {
    const t = custom.trim();
    if (t && !interests.includes(t)) setInterests((s) => [...s, t]);
    setCustom('');
  };
  const updateLink = (i: number, change: Partial<SocialLink>) =>
    setLinks((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...change } : l)));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateMe({
        displayName: displayName.trim(),
        bio: bio.trim(),
        relationshipStatus: status,
        interests,
        socialLinks: links
          .filter((l) => l.url.trim())
          .map((l) => ({ platform: l.platform, url: normalizeUrl(l.url), handle: l.handle.trim() })),
      });
      setMe(updated);
      navigation.goBack();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <ErrorBanner message={error} />
        <Field label="Nombre" value={displayName} onChangeText={setDisplayName} maxLength={100} />
        <Field label="Sobre ti" value={bio} onChangeText={setBio} multiline maxLength={300}
          placeholder="Qué haces, qué buscas, de qué te gusta hablar" hint={`${bio.length}/300`} />

        <Text style={[T.label, { marginBottom: 8 }]}>Situación sentimental</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
          {STATUSES.map((s) => <Chip key={s} label={RELATIONSHIP_LABELS[s]} selected={status === s} onPress={() => setStatus(s)} />)}
        </View>

        <Text style={[T.label, { marginBottom: 8 }]}>Intereses ({interests.length}/20)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {options.map((t) => <Chip key={t} label={t} selected={interests.includes(t)} onPress={() => toggle(t)} />)}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 24 }}>
          <TextInput value={custom} onChangeText={setCustom} onSubmitEditing={addCustom} placeholder="Añadir otro interés"
            placeholderTextColor={C.haze} maxLength={50} accessibilityLabel="Añadir otro interés"
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 999, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 8, fontSize: 15, color: C.ink }} />
          <Button title="Añadir" compact variant="secondary" onPress={addCustom} disabled={!custom.trim() || interests.length >= 20} />
        </View>

        <Text style={[T.label, { marginBottom: 8 }]}>Tus otras redes</Text>
        {links.map((l, i) => (
          <View key={i} style={{ backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name={platformInfo(l.platform).icon} size={20} color={C.ink} />
              <Text style={[T.name, { flex: 1, marginLeft: 8 }]}>{platformInfo(l.platform).label}</Text>
              <Pressable onPress={() => setLinks((ls) => ls.filter((_, idx) => idx !== i))} hitSlop={10}
                accessibilityRole="button" accessibilityLabel="Quitar esta red">
                <Ionicons name="trash-outline" size={20} color={C.danger} />
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {PLATFORMS.map((p) => (
                <Chip key={p.id} label={p.label} selected={l.platform === p.id} onPress={() => updateLink(i, { platform: p.id })} />
              ))}
            </ScrollView>
            <TextInput value={l.url} onChangeText={(url) => updateLink(i, { url })} placeholder="instagram.com/tu_usuario"
              placeholderTextColor={C.haze} autoCapitalize="none" keyboardType="url" accessibilityLabel="Enlace"
              style={{ backgroundColor: C.paper, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.ink, marginBottom: 8 }} />
            <TextInput value={l.handle} onChangeText={(handle) => updateLink(i, { handle })} placeholder="@tu_usuario (opcional)"
              placeholderTextColor={C.haze} autoCapitalize="none" accessibilityLabel="Nombre de usuario"
              style={{ backgroundColor: C.paper, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.ink }} />
          </View>
        ))}
        {links.length < 10 && (
          <Button title="Añadir red" icon="add" variant="secondary" compact style={{ alignSelf: 'flex-start', marginBottom: 28 }}
            onPress={() => setLinks((ls) => [...ls, { platform: 'instagram', url: '', handle: '' }])} />
        )}

        <Button title="Guardar perfil" onPress={save} loading={saving} disabled={!displayName.trim()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
