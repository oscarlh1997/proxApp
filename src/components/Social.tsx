import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from '../theme';
import { SocialLink } from '../types';

export const PLATFORMS: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { id: 'twitter', label: 'X / Twitter', icon: 'logo-twitter' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
  { id: 'github', label: 'GitHub', icon: 'logo-github' },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { id: 'twitch', label: 'Twitch', icon: 'logo-twitch' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
  { id: 'spotify', label: 'Spotify', icon: 'musical-notes' },
  { id: 'strava', label: 'Strava', icon: 'bicycle' },
  { id: 'otro', label: 'Otra web', icon: 'link' },
];

export const platformInfo = (id: string) =>
  PLATFORMS.find((p) => p.id === id) ?? { id, label: id, icon: 'link' as const };

/** Fila tocable que abre el perfil en la otra red social. */
export function SocialLinkRow({ link, last }: { link: SocialLink; last?: boolean }) {
  const p = platformInfo(link.platform);
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Abrir ${p.label} ${link.handle}`}
      onPress={() => Linking.openURL(link.url).catch(() => {})}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12,
        borderBottomWidth: last ? 0 : 1, borderBottomColor: C.line, opacity: pressed ? 0.6 : 1,
      })}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={p.icon} size={20} color={C.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={T.name}>{p.label}</Text>
        <Text style={T.meta} numberOfLines={1}>{link.handle || link.url}</Text>
      </View>
      <Ionicons name="open-outline" size={18} color={C.haze} />
    </Pressable>
  );
}

/** Iconos compactos de las redes que tiene alguien (para listas). */
export function SocialIcons({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {links.slice(0, 4).map((l, i) => (
        <Ionicons key={i} name={platformInfo(l.platform).icon} size={15} color={C.haze} />
      ))}
    </View>
  );
}
