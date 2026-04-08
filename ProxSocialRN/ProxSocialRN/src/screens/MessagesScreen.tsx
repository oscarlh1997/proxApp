import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { api } from '../api/client';
import { Conversation } from '../types/models';
import { timeAgo } from '../utils/time';

export default function MessagesScreen() {
  const nav = useNavigation<any>();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { setConvos(await api.getConversations()); } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: Colors.bg }}
      contentContainerStyle={{ padding: 12 }}
      data={convos}
      keyExtractor={c => c.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => {
        const other = item.members[0];
        return (
          <Pressable onPress={() => nav.navigate('Chat', { conversationId: item.id, otherName: other?.display_name || 'Chat' })}
            style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Avatar seed={other?.avatar_seed || 'x'} size={44} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: Colors.text, fontWeight: '800' }}>{other?.display_name || 'Usuario'}</Text>
              <Text style={{ color: Colors.subtext, marginTop: 4 }} numberOfLines={1}>{item.lastText || 'Sin mensajes'}</Text>
            </View>
            {item.lastAt && <Text style={{ color: Colors.subtext, fontSize: 12 }}>{timeAgo(item.lastAt)}</Text>}
          </Pressable>
        );
      }}
      ListEmptyComponent={<Text style={{ color: Colors.subtext, textAlign: 'center', marginTop: 40 }}>Sin conversaciones. Conecta con alguien cercano para chatear.</Text>}
    />
  );
}
