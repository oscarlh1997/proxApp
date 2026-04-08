import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostCard } from '../components/PostCard';
import { Colors } from '../theme/colors';
import { api } from '../api/client';
import { Post } from '../types/models';


import { NearbyUserCard } from '../components/NearbyUserCard';
import { TagChip } from '../components/TagChip';



export default function FeedScreen() {
  const nav = useNavigation<any>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const load = useCallback(async () => {
    try {
      const [feedData, nearbyData] = await Promise.all([api.getFeed(), api.getNearby(0.5)]);
      setPosts(feedData);
      setNearby(nearbyData);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const createPost = async () => {
    if (!newPostText.trim()) return;
    try {
      await api.createPost(newPostText.trim(), []);
      setNewPostText('');
      setShowCompose(false);
      load();
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const toggleLike = async (postId: string) => {
    try {
      const res = await api.toggleLike(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: res.liked, likeCount: res.likeCount } : p));
    } catch {}
  };

  const toggleSave = async (postId: string) => {
    try {
      const res = await api.toggleSave(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, saved: res.saved } : p));
    } catch {}
  };

  const header = () => (
    <View>
      {/* Nearby preview */}
      {nearby.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>Cerca de ti</Text>
          <View style={{ marginTop: 8 }}>
            {nearby.slice(0, 3).map((u: any) => (
              <NearbyUserCard key={u.id} user={u}
                onConnect={() => nav.navigate('UserDetail', { userId: u.id, nearbyUser: u })} />
            ))}
          </View>
        </View>
      )}

      {/* Compose */}
      {showCompose ? (
        <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 14 }}>
          <TextInput value={newPostText} onChangeText={setNewPostText} placeholder="¿Qué quieres compartir?"
            placeholderTextColor={Colors.subtext} multiline
            style={{ color: Colors.text, minHeight: 60, textAlignVertical: 'top' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <Pressable onPress={() => setShowCompose(false)} style={{ paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 }}>
              <Text style={{ color: Colors.subtext }}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={createPost}
              style={{ backgroundColor: Colors.primary, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999 }}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Publicar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setShowCompose(true)}
          style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 14 }}>
          <Text style={{ color: Colors.subtext }}>¿Qué quieres compartir?</Text>
        </Pressable>
      )}

      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 10 }}>Feed</Text>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: Colors.bg }}
      contentContainerStyle={{ padding: 12 }}
      data={posts}
      keyExtractor={p => p.id}
      ListHeaderComponent={header}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <PostCard post={item}
          onOpen={() => nav.navigate('PostDetail', { postId: item.id })}
          onLike={() => toggleLike(item.id)}
          onSave={() => toggleSave(item.id)} />
      )}
      ListEmptyComponent={<Text style={{ color: Colors.subtext, textAlign: 'center', marginTop: 20 }}>Sin publicaciones aún. ¡Sé el primero!</Text>}
    />
  );
}
