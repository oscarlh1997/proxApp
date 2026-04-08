import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { api } from '../api/client';
import { TAGS } from '../mock/mockTags';
import { SocialLink, UserProfile } from '../types/models';

const STATUSES = [
  { value: 'no_especificado', label: 'No especificado' },
  { value: 'soltero', label: 'Soltero' },
  { value: 'soltera', label: 'Soltera' },
  { value: 'en_relacion', label: 'En una relación' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'es_complicado', label: 'Es complicado' },
];

const PLATFORMS = ['instagram', 'twitter', 'linkedin', 'github', 'twitch', 'strava', 'youtube', 'tiktok', 'spotify', 'facebook', 'otro'];

export default function EditProfileScreen() {
  const nav = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('no_especificado');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getMe().then((p: UserProfile) => {
      setProfile(p);
      setDisplayName(p.displayName);
      setBio(p.bio);
      setStatus(p.relationshipStatus);
      setSelectedTags(p.interests);
      setSocialLinks(p.socialLinks.length ? p.socialLinks : [{ platform: 'instagram', url: '', handle: '' }]);
    });
  }, []);

  const toggleTag = (t: string) => {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const updateLink = (i: number, field: keyof SocialLink, val: string) => {
    setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  };

  const addLink = () => setSocialLinks(prev => [...prev, { platform: 'instagram', url: '', handle: '' }]);
  const removeLink = (i: number) => setSocialLinks(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await api.updateMe({
        displayName, bio, relationshipStatus: status,
        interests: selectedTags,
        socialLinks: socialLinks.filter(l => l.url.trim()),
      });
      Alert.alert('Guardado', 'Perfil actualizado');
      nav.goBack();
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setSaving(false); }
  };

  if (!profile) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}><ActivityIndicator size="large" color={Colors.primary} /></View>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {/* Basic info */}
      <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Nombre</Text>
      <TextInput value={displayName} onChangeText={setDisplayName}
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 16 }} />

      <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Bio</Text>
      <TextInput value={bio} onChangeText={setBio} multiline numberOfLines={3}
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 16, minHeight: 80, textAlignVertical: 'top' }} />

      {/* Relationship */}
      <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Situación sentimental</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {STATUSES.map(s => (
          <Pressable key={s.value} onPress={() => setStatus(s.value)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginRight: 8, marginBottom: 8,
              backgroundColor: status === s.value ? Colors.primary : Colors.card,
              borderWidth: 1, borderColor: status === s.value ? Colors.primary : Colors.border }}>
            <Text style={{ color: status === s.value ? 'white' : Colors.text, fontWeight: '600', fontSize: 13 }}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Interests */}
      <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Intereses</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {TAGS.map(t => (
          <Pressable key={t} onPress={() => toggleTag(t)}
            style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, marginRight: 8, marginBottom: 8,
              backgroundColor: selectedTags.includes(t) ? Colors.primary : Colors.card,
              borderWidth: 1, borderColor: selectedTags.includes(t) ? Colors.primary : Colors.border }}>
            <Text style={{ color: selectedTags.includes(t) ? 'white' : Colors.text, fontSize: 13 }}>#{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Social Links */}
      <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Redes sociales</Text>
      {socialLinks.map((link, i) => (
        <View key={i} style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            {PLATFORMS.map(p => (
              <Pressable key={p} onPress={() => updateLink(i, 'platform', p)}
                style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, marginRight: 6, marginBottom: 6,
                  backgroundColor: link.platform === p ? Colors.primary : '#F1F5F9',
                  borderWidth: 1, borderColor: link.platform === p ? Colors.primary : Colors.border }}>
                <Text style={{ color: link.platform === p ? 'white' : Colors.subtext, fontSize: 11, textTransform: 'capitalize' }}>{p}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput placeholder="URL (https://...)" placeholderTextColor={Colors.subtext} value={link.url}
            onChangeText={v => updateLink(i, 'url', v)} autoCapitalize="none"
            style={{ backgroundColor: Colors.bg, borderRadius: 8, padding: 10, color: Colors.text, marginBottom: 6, borderWidth: 1, borderColor: Colors.border }} />
          <TextInput placeholder="Handle (@usuario)" placeholderTextColor={Colors.subtext} value={link.handle}
            onChangeText={v => updateLink(i, 'handle', v)} autoCapitalize="none"
            style={{ backgroundColor: Colors.bg, borderRadius: 8, padding: 10, color: Colors.text, borderWidth: 1, borderColor: Colors.border }} />
          {socialLinks.length > 1 && (
            <Pressable onPress={() => removeLink(i)} style={{ marginTop: 8 }}>
              <Text style={{ color: '#EF4444', fontSize: 13 }}>Eliminar</Text>
            </Pressable>
          )}
        </View>
      ))}
      <Pressable onPress={addLink} style={{ padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: Colors.primary, fontWeight: '700' }}>+ Añadir red social</Text>
      </Pressable>

      {/* Save */}
      <Pressable onPress={save} disabled={saving}
        style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 40 }}>
        {saving ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Guardar perfil</Text>}
      </Pressable>
    </ScrollView>
  );
}
