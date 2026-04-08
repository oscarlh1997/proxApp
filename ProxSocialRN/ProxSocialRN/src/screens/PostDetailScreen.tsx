import React, { useCallback, useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, Text, TextInput, View, Pressable, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { timeAgo } from '../utils/time';
import { api } from '../api/client';
import { Comment } from '../types/models';

type R = RouteProp<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen() {
  const route = useRoute<R>();
  const { postId } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { setComments(await api.getComments(postId)); }
    catch {} finally { setLoading(false); }
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.addComment(postId, text.trim());
      setText('');
      load();
    } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '900', color: Colors.text }}>Comentarios</Text>

      <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput value={text} onChangeText={setText} placeholder="Escribe un comentario…"
          placeholderTextColor={Colors.subtext}
          style={{ flex: 1, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 10, color: Colors.text }} />
        <Pressable onPress={send}
          style={{ marginLeft: 10, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 }}>
          <Text style={{ color: 'white', fontWeight: '900' }}>Enviar</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 12 }}>
        {loading ? <ActivityIndicator color={Colors.primary} /> :
          comments.length === 0 ? <Text style={{ color: Colors.subtext }}>Sé el primero en comentar.</Text> :
          comments.map((c) => (
            <View key={c.id} style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar seed={c.authorAvatarSeed} size={34} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ color: Colors.text, fontWeight: '800' }}>{c.authorName}</Text>
                  <Text style={{ color: Colors.subtext }}>{timeAgo(c.createdAt)}</Text>
                </View>
              </View>
              <Text style={{ color: Colors.text, marginTop: 8, lineHeight: 20 }}>{c.text}</Text>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}
