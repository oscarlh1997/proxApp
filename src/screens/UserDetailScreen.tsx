import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { api, errorMessage } from '../api/client';
import { useAuth, useMe } from '../store';
import { C } from '../theme';
import { ConnectionStatus, UserProfile } from '../types';
import { ScreenProps } from '../navigation/types';
import { formatDistance } from '../utils/format';
import { ProfileHeader } from '../components/ProfileHeader';
import { Button } from '../components/Button';
import { ErrorBanner, Loading } from '../components/States';

const CONNECT_LABEL: Record<ConnectionStatus, string> = {
  none: 'Conectar',
  pending_sent: 'Solicitud enviada',
  pending_received: 'Aceptar solicitud',
  accepted: 'Conectados',
};

export default function UserDetailScreen({ route, navigation }: ScreenProps<'UserDetail'>) {
  const { userId, nearby } = route.params;
  const myId = useAuth((s) => s.userId);
  const me = useMe((s) => s.me);
  const [profile, setProfile] = useState<UserProfile | null>(nearby ?? null);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMe = userId === myId;

  useEffect(() => {
    api.getUser(userId).then(setProfile).catch((e) => setError(errorMessage(e)));
    if (!isMe) api.connectionWith(userId).then((r) => setStatus(r.status)).catch(() => {});
  }, [userId, isMe]);

  const connect = async () => {
    setBusy(true);
    try { setStatus((await api.connect(userId)).status); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  };

  const write = async () => {
    if (!profile) return;
    setBusy(true);
    try {
      const { id } = await api.openConversation(userId);
      navigation.navigate('Chat', { conversationId: id, name: profile.displayName, avatarSeed: profile.avatarSeed });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (!profile) return error ? <View style={{ padding: 20 }}><ErrorBanner message={error} /></View> : <Loading />;

  const shared = me && !isMe ? profile.interests.filter((t) => me.interests.includes(t)) : [];

  return (
    <ScrollView style={{ backgroundColor: C.paper }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ paddingHorizontal: 20 }}><ErrorBanner message={error} /></View>
      <ProfileHeader profile={profile} distance={nearby ? formatDistance(nearby.distanceM) : undefined} sharedInterests={shared}>
        {!isMe && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <Button title="Escribir" icon="paper-plane" onPress={write} disabled={busy} style={{ flex: 1 }} />
            <Button
              title={status ? CONNECT_LABEL[status] : '…'}
              icon={status === 'accepted' ? 'checkmark' : 'person-add-outline'}
              variant="secondary"
              onPress={connect}
              disabled={busy || !status || status === 'pending_sent' || status === 'accepted'}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </ProfileHeader>
    </ScrollView>
  );
}
