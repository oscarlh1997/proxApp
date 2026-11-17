import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api, errorMessage } from '../api/client';
import { C, T } from '../theme';
import { Post } from '../types';
import { useMe } from '../store';
import { PostItem } from '../components/PostItem';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Empty, ErrorBanner } from '../components/States';

const PAGE = 20;

export default function FeedScreen() {
  const nav = useNavigation();
  const me = useMe((s) => s.me);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const page = await api.getFeed(PAGE, 0);
      setPosts(page);
      setHasMore(page.length === PAGE);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoaded(true);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const loadMore = async () => {
    if (!hasMore || !loaded) return;
    try {
      const page = await api.getFeed(PAGE, posts.length);
      setPosts((p) => [...p, ...page.filter((n) => !p.some((o) => o.id === n.id))]);
      setHasMore(page.length === PAGE);
    } catch {}
  };

  const publish = async () => {
    setPosting(true);
    try {
      await api.createPost(draft.trim());
      setDraft('');
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPosting(false);
    }
  };

  const patch = (id: string, change: Partial<Post>) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...change } : x)));

  const like = async (post: Post) => {
    // Respuesta inmediata; se corrige con lo que devuelva el servidor
    patch(post.id, { liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) });
    try { patch(post.id, await api.toggleLike(post.id)); } catch { patch(post.id, { liked: post.liked, likeCount: post.likeCount }); }
  };
  const save = async (post: Post) => {
    patch(post.id, { saved: !post.saved });
    try { patch(post.id, await api.toggleSave(post.id)); } catch { patch(post.id, { saved: post.saved }); }
  };

  const composer = (
    <View>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 }}>
        <Text style={T.display}>Muro</Text>
        <Text style={T.meta}>Lo que comparte la gente</Text>
      </View>
      <View style={{ marginHorizontal: 20, marginBottom: 8, backgroundColor: C.surface, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12 }}>
        {me && <Avatar name={me.displayName} seed={me.avatarSeed} size={36} />}
        <View style={{ flex: 1 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="¿Qué planes tienes por aquí?"
            placeholderTextColor={C.haze}
            multiline
            maxLength={1000}
            accessibilityLabel="Escribe una publicación"
            style={{ fontSize: 16, color: C.ink, minHeight: 40, paddingTop: 6 }}
          />
          {draft.trim().length > 0 && (
            <Button title="Publicar" compact onPress={publish} loading={posting} style={{ alignSelf: 'flex-end', marginTop: 8 }} />
          )}
        </View>
      </View>
      <View style={{ marginHorizontal: 20 }}><ErrorBanner message={error} /></View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.paper }}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={composer}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.line, marginLeft: 72 }} />}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onOpen={() => nav.navigate('PostDetail', { post: item })}
            onAuthor={() => nav.navigate('UserDetail', { userId: item.authorId })}
            onLike={() => like(item)}
            onSave={() => save(item)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
        ListEmptyComponent={loaded && !error ? <Empty icon="chatbubbles-outline" title="Todavía no hay publicaciones" text="Escribe la primera arriba." /> : null}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
