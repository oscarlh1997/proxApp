import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { TagChip } from '../components/TagChip';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { UserProfile } from '../types/models';

const STATUS_LABELS: Record<string, string> = {
  soltero: 'Soltero', soltera: 'Soltera', en_relacion: 'En una relación',
  casado: 'Casado/a', es_complicado: 'Es complicado', no_especificado: '',
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📷', twitter: '🐦', linkedin: '💼', github: '🐙',
  twitch: '🎮', strava: '🏃', flickr: '📸', youtube: '▶️',
  tiktok: '🎵', spotify: '🎧', facebook: '👤', default: '🔗',
};

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const load = useCallback(async () => {
    try { setProfile(await api.getMe()); } catch {}
  }, []);

  useEffect(() => {
    const unsub = nav.addListener('focus', load);
    return unsub;
  }, [nav, load]);

  if (!profile) return <View style={{ flex: 1, backgroundColor: Colors.bg }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {/* Profile card */}
      <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 16, alignItems: 'center' }}>
        <Avatar seed={profile.avatarSeed} size={80} />
        <Text style={{ fontSize: 20, fontWeight: '900', color: Colors.text, marginTop: 12 }}>{profile.displayName}</Text>
        <Text style={{ color: Colors.subtext, marginTop: 4 }}>@{profile.username}</Text>
        {profile.bio ? <Text style={{ color: Colors.subtext, marginTop: 8, textAlign: 'center' }}>{profile.bio}</Text> : null}
        {STATUS_LABELS[profile.relationshipStatus] ? (
          <View style={{ marginTop: 8, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 }}>
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>{STATUS_LABELS[profile.relationshipStatus]}</Text>
          </View>
        ) : null}
        {profile.interests.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' }}>
            {profile.interests.map(t => <TagChip key={t} label={t} />)}
          </View>
        )}
      </View>

      {/* Social links */}
      {profile.socialLinks.length > 0 && (
        <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, marginTop: 14 }}>
          <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Mis redes sociales</Text>
          {profile.socialLinks.map((link, i) => (
            <Pressable key={i} onPress={() => Linking.openURL(link.url)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: Colors.border }}>
              <Text style={{ fontSize: 20, width: 32 }}>{PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.default}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.text, fontWeight: '700', textTransform: 'capitalize' }}>{link.platform}</Text>
                <Text style={{ color: Colors.primary, fontSize: 13 }}>{link.handle || link.url}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* Actions */}
      <Pressable onPress={() => nav.navigate('EditProfile')}
        style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 14 }}>
        <Text style={{ color: 'white', fontWeight: '800' }}>Editar perfil</Text>
      </Pressable>

      <Pressable onPress={logout}
        style={{ borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: Colors.border }}>
        <Text style={{ color: '#EF4444', fontWeight: '700' }}>Cerrar sesión</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
