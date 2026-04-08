import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { TagChip } from '../components/TagChip';
import { api } from '../api/client';
import { UserProfile } from '../types/models';
import { RootStackParamList } from '../navigation/RootNavigator';

type R = RouteProp<RootStackParamList, 'UserDetail'>;

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📷', twitter: '🐦', linkedin: '💼', github: '🐙',
  twitch: '🎮', strava: '🏃', flickr: '📸', youtube: '▶️',
  tiktok: '🎵', spotify: '🎧', facebook: '👤', default: '🔗',
};

const STATUS_LABELS: Record<string, string> = {
  soltero: 'Soltero', soltera: 'Soltera', en_relacion: 'En una relación',
  casado: 'Casado', casada: 'Casada', es_complicado: 'Es complicado', no_especificado: '',
};

export default function UserDetailScreen() {
  const route = useRoute<R>();
  const nav = useNavigation<any>();
  const { userId, nearbyUser } = route.params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      api.getUser(userId).then(setProfile).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  const data = profile || (nearbyUser ? {
    id: nearbyUser.id, displayName: nearbyUser.displayName, bio: nearbyUser.bio || '',
    avatarSeed: nearbyUser.avatarSeed, relationshipStatus: nearbyUser.relationshipStatus || 'no_especificado',
    interests: nearbyUser.interests || nearbyUser.tags || [], socialLinks: nearbyUser.socialLinks || [],
  } : null);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (!data) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}><Text style={{ color: Colors.subtext }}>Usuario no encontrado</Text></View>;

  const handleConnect = async () => {
    if (!data.id) return;
    try {
      await api.connect(data.id);
      Alert.alert('Solicitud enviada', `Le has enviado una solicitud de conexión a ${data.displayName}`);
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const handleMessage = async () => {
    if (!data.id) return;
    try {
      const { id } = await api.createConversation(data.id);
      nav.navigate('Chat', { conversationId: id, otherName: data.displayName });
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Avatar seed={data.avatarSeed} size={90} />
        <Text style={{ fontSize: 22, fontWeight: '900', color: Colors.text, marginTop: 12 }}>{data.displayName}</Text>
        {data.bio ? <Text style={{ color: Colors.subtext, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 }}>{data.bio}</Text> : null}
        {STATUS_LABELS[data.relationshipStatus as string] ? (
          <View style={{ marginTop: 8, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 }}>
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>
              {STATUS_LABELS[data.relationshipStatus as string]}
            </Text>
          </View>
        ) : null}
        {nearbyUser ? (
          <Text style={{ color: Colors.subtext, marginTop: 8 }}>~{nearbyUser.distanceM.toFixed(0)} m de ti</Text>
        ) : null}
      </View>

      {/* Action buttons */}
      {data.id && (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <Pressable onPress={handleConnect}
            style={{ flex: 1, backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '800' }}>Conectar</Text>
          </Pressable>
          <Pressable onPress={handleMessage}
            style={{ flex: 1, backgroundColor: Colors.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border }}>
            <Text style={{ color: Colors.text, fontWeight: '800' }}>Mensaje</Text>
          </Pressable>
        </View>
      )}

      {/* Interests */}
      {(data.interests as string[])?.length > 0 && (
        <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 8 }}>Intereses</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(data.interests as string[]).map(t => <TagChip key={t} label={t} />)}
          </View>
        </View>
      )}

      {/* Social Links - THIS IS THE KEY FEATURE */}
      {(data.socialLinks as any[])?.length > 0 && (
        <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontWeight: '800', color: Colors.text, marginBottom: 10 }}>Redes sociales</Text>
          {(data.socialLinks as any[]).map((link, i) => (
            <Pressable key={i} onPress={() => Linking.openURL(link.url)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: Colors.border }}>
              <Text style={{ fontSize: 22, width: 36 }}>{PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.default}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.text, fontWeight: '700', textTransform: 'capitalize' }}>{link.platform}</Text>
                <Text style={{ color: Colors.primary, fontSize: 13 }}>{link.handle || link.url}</Text>
              </View>
              <Text style={{ color: Colors.subtext, fontSize: 18 }}>→</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
