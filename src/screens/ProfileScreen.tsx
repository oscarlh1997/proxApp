import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api, errorMessage } from '../api/client';
import { useAuth, useMe } from '../store';
import { C, T } from '../theme';
import { ConnectionItem } from '../types';
import { ProfileHeader, Section } from '../components/ProfileHeader';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ErrorBanner, Loading } from '../components/States';

export default function ProfileScreen() {
  const nav = useNavigation();
  const logout = useAuth((s) => s.logout);
  const { me, setMe } = useMe();
  const [requests, setRequests] = useState<ConnectionItem[]>([]);
  const [contacts, setContacts] = useState<ConnectionItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [profile, conns] = await Promise.all([api.getMe(), api.getConnections()]);
      setMe(profile);
      setRequests(conns.received.filter((c) => c.status === 'pending'));
      setContacts([...conns.sent, ...conns.received].filter((c) => c.status === 'accepted'));
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [setMe]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const respond = async (userId: string, accept: boolean) => {
    try {
      await (accept ? api.acceptConnection(userId) : api.rejectConnection(userId));
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  if (!me) return error ? <View style={{ padding: 20 }}><ErrorBanner message={error} /></View> : <Loading />;

  const empty = !me.bio && me.interests.length === 0 && me.socialLinks.length === 0;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.paper }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
      >
        <View style={{ paddingHorizontal: 20 }}><ErrorBanner message={error} /></View>
        <ProfileHeader profile={me}>
          {empty && (
            <Text style={[T.meta, { fontSize: 15 }]}>
              Tu perfil está vacío. Añade intereses y tus otras redes para que la gente cercana sepa quién eres.
            </Text>
          )}
          <Button title="Editar perfil" icon="create-outline" variant="secondary"
            onPress={() => nav.navigate('EditProfile')} style={{ alignSelf: 'flex-start', marginTop: 4 }} compact />
        </ProfileHeader>

        {requests.length > 0 && (
          <Section title={`Solicitudes (${requests.length})`}>
            {requests.map((r) => (
              <View key={r.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                <Avatar name={r.displayName} seed={r.avatarSeed} size={40} />
                <Text style={[T.name, { flex: 1 }]} numberOfLines={1}
                  onPress={() => nav.navigate('UserDetail', { userId: r.userId })}>{r.displayName}</Text>
                <Button title="Rechazar" variant="ghost" compact onPress={() => respond(r.userId, false)} />
                <Button title="Aceptar" compact onPress={() => respond(r.userId, true)} />
              </View>
            ))}
          </Section>
        )}

        {contacts.length > 0 && (
          <Section title="Conexiones">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
              {contacts.map((c) => (
                <View key={c.userId} style={{ alignItems: 'center', width: 64 }}>
                  <Avatar name={c.displayName} seed={c.avatarSeed} size={52} />
                  <Text style={[T.meta, { marginTop: 4 }]} numberOfLines={1}
                    onPress={() => nav.navigate('UserDetail', { userId: c.userId })}>{c.displayName.split(' ')[0]}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.line }}>
          <Button title="Cerrar sesión" variant="danger" icon="log-out-outline" onPress={logout} style={{ alignSelf: 'flex-start', marginLeft: -20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
