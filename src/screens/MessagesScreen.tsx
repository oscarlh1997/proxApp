import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api, errorMessage } from '../api/client';
import { C, T } from '../theme';
import { Conversation } from '../types';
import { timeAgo } from '../utils/format';
import { Avatar } from '../components/Avatar';
import { Empty, ErrorBanner } from '../components/States';

export default function MessagesScreen() {
  const nav = useNavigation();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setItems(await api.getConversations()); setError(null); } catch (e) { setError(errorMessage(e)); } finally { setLoaded(true); }
  }, []);

  // Se recarga al volver de un chat para mostrar el último mensaje
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.paper }}>
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
            <Text style={T.display}>Mensajes</Text>
            <ErrorBanner message={error} />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.line, marginLeft: 84 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => nav.navigate('Chat', { conversationId: item.id, name: item.other.displayName, avatarSeed: item.other.avatarSeed })}
            accessibilityRole="button"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: pressed ? C.surface : 'transparent' })}
          >
            <Avatar name={item.other.displayName} seed={item.other.avatarSeed} size={52} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={T.name} numberOfLines={1}>{item.other.displayName}</Text>
                {item.lastAt && <Text style={T.meta}>{timeAgo(item.lastAt)}</Text>}
              </View>
              <Text style={[T.meta, { fontSize: 14 }]} numberOfLines={1}>
                {item.lastText ? `${item.lastFromMe ? 'Tú: ' : ''}${item.lastText}` : 'Di hola'}
              </Text>
            </View>
          </Pressable>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
        ListEmptyComponent={loaded && !error ? (
          <Empty icon="paper-plane-outline" title="Aún no hablas con nadie"
            text="Abre el perfil de alguien en el radar y pulsa Escribir." />
        ) : null}
      />
    </SafeAreaView>
  );
}
