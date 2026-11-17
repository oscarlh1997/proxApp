import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from '../theme';
import { Post } from '../types';
import { timeAgo } from '../utils/format';
import { Avatar } from './Avatar';

function Action({ icon, label, color, onPress, a11y }: {
  icon: keyof typeof Ionicons.glyphMap; label?: string; color: string; onPress: () => void; a11y: string;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10} accessibilityRole="button" accessibilityLabel={a11y}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5, minWidth: 44, minHeight: 32 }}>
      <Ionicons name={icon} size={20} color={color} />
      {label !== undefined && <Text style={{ color, fontSize: 13, fontWeight: '600' }}>{label}</Text>}
    </Pressable>
  );
}

export function PostItem({ post, onOpen, onAuthor, onLike, onSave, showActions = true }: {
  post: Post; onOpen?: () => void; onAuthor?: () => void; onLike?: () => void; onSave?: () => void; showActions?: boolean;
}) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', gap: 12 }}>
      <Pressable onPress={onAuthor} accessibilityRole="button" accessibilityLabel={`Ver perfil de ${post.authorName}`}>
        <Avatar name={post.authorName} seed={post.authorAvatarSeed} size={40} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Text style={T.name} onPress={onAuthor}>{post.authorName}</Text>
          <Text style={T.meta}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Pressable onPress={onOpen} disabled={!onOpen}>
          <Text style={[T.body, { marginTop: 4, fontSize: 16, lineHeight: 22 }]}>{post.text}</Text>
          {post.tags.length > 0 && (
            <Text style={{ color: C.signal, marginTop: 6, fontSize: 14, fontWeight: '600' }}>
              {post.tags.map((t) => `#${t}`).join('  ')}
            </Text>
          )}
        </Pressable>
        {showActions && (
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 10 }}>
            <Action icon={post.liked ? 'heart' : 'heart-outline'} label={String(post.likeCount)}
              color={post.liked ? C.pulse : C.haze} onPress={() => onLike?.()} a11y={post.liked ? 'Quitar me gusta' : 'Me gusta'} />
            <Action icon="chatbubble-outline" label={String(post.commentCount)} color={C.haze}
              onPress={() => onOpen?.()} a11y="Ver comentarios" />
            <View style={{ flex: 1 }} />
            <Action icon={post.saved ? 'bookmark' : 'bookmark-outline'} color={post.saved ? C.signal : C.haze}
              onPress={() => onSave?.()} a11y={post.saved ? 'Quitar de guardados' : 'Guardar'} />
          </View>
        )}
      </View>
    </View>
  );
}
