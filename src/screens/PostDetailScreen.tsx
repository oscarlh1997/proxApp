import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api, errorMessage } from '../api/client';
import { C, T } from '../theme';
import { Comment } from '../types';
import { ScreenProps } from '../navigation/types';
import { timeAgo } from '../utils/format';
import { PostItem } from '../components/PostItem';
import { Avatar } from '../components/Avatar';
import { Empty, ErrorBanner } from '../components/States';

export default function PostDetailScreen({ route, navigation }: ScreenProps<'PostDetail'>) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setComments(await api.getComments(post.id)); } catch (e) { setError(errorMessage(e)); } finally { setLoaded(true); }
  }, [post.id]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    setSending(true);
    try {
      await api.addComment(post.id, text.trim());
      setText('');
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  const canSend = text.trim().length > 0 && !sending;

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: C.paper }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          ListHeaderComponent={
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.line, marginBottom: 4 }}>
              <PostItem post={post} showActions={false}
                onAuthor={() => navigation.navigate('UserDetail', { userId: post.authorId })} />
              <View style={{ marginHorizontal: 20 }}><ErrorBanner message={error} /></View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
              <Pressable onPress={() => navigation.navigate('UserDetail', { userId: item.authorId })}>
                <Avatar name={item.authorName} seed={item.authorAvatarSeed} size={32} />
              </Pressable>
              <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 10 }}>
                <Text style={[T.name, { fontSize: 14 }]}>
                  {item.authorName} <Text style={[T.meta, { fontWeight: '400' }]}>{timeAgo(item.createdAt)}</Text>
                </Text>
                <Text style={[T.body, { marginTop: 2 }]}>{item.text}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={loaded ? <Empty icon="chatbubble-ellipses-outline" title="Sin comentarios todavía" /> : null}
        />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe un comentario"
            placeholderTextColor={C.haze}
            multiline
            maxLength={1000}
            accessibilityLabel="Comentario"
            style={{ flex: 1, backgroundColor: C.paper, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.ink, maxHeight: 110 }}
          />
          <Pressable onPress={send} disabled={!canSend} accessibilityRole="button" accessibilityLabel="Enviar comentario"
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: canSend ? C.signal : C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
