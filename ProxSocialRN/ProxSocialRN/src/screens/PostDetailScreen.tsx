import React, { useMemo, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFeedStore } from '../store/useFeedStore';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { timeAgo } from '../utils/time';

type R = RouteProp<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen() {
  const route = useRoute<R>();
  const { postId } = route.params;

  const { posts, comments, addComment } = useFeedStore();
  const post = posts.find((p) => p.id === postId);

  const [text, setText] = useState('');

  const postComments = useMemo(() => comments.filter((c) => c.postId === postId), [comments, postId]);

  if (!post) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Post no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar seed={post.authorAvatarSeed} size={40} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: Colors.text, fontWeight: '800' }}>{post.authorName}</Text>
            <Text style={{ color: Colors.subtext }}>{timeAgo(post.createdAt)}</Text>
          </View>
        </View>
        <Text style={{ color: Colors.text, fontSize: 16, lineHeight: 22, marginTop: 10 }}>
          {post.text}
        </Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '900', color: Colors.text }}>Comentarios</Text>

        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe un comentario…"
            placeholderTextColor={Colors.subtext}
            style={{
              flex: 1,
              backgroundColor: Colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.border,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: Colors.text,
            }}
          />
          <Pressable
            onPress={() => {
              if (text.trim().length === 0) return;
              addComment(postId, text.trim());
              setText('');
            }}
            style={{
              marginLeft: 10,
              backgroundColor: Colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '900' }}>Enviar</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 12 }}>
          {postComments.length === 0 ? (
            <Text style={{ color: Colors.subtext }}>Sé el primero en comentar.</Text>
          ) : (
            postComments.map((c) => (
              <View
                key={c.id}
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
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
          )}
        </View>
      </View>
    </ScrollView>
  );
}
