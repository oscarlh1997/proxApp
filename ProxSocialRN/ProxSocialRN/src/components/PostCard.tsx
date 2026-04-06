import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Post } from '../types/models';
import { Avatar } from './Avatar';
import { TagChip } from './TagChip';
import { timeAgo } from '../utils/time';

export const PostCard: React.FC<{
  post: Post;
  onOpen: () => void;
  onLike: () => void;
  onSave: () => void;
}> = ({ post, onOpen, onLike, onSave }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar seed={post.authorAvatarSeed} size={40} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: Colors.text, fontWeight: '700' }}>{post.authorName}</Text>
          <Text style={{ color: Colors.subtext, marginTop: 2 }}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Text style={{ color: Colors.subtext }}>⋯</Text>
      </View>

      <Pressable onPress={onOpen} style={{ marginTop: 10 }}>
        <Text style={{ color: Colors.text, fontSize: 16, lineHeight: 22 }}>{post.text}</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
        {post.tags.map((t) => (
          <TagChip key={t} label={t} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
        <Pressable onPress={onLike} style={{ marginRight: 14 }}>
          <Text style={{ color: post.liked ? Colors.primary : Colors.subtext }}>
            ♥ {post.likeCount}
          </Text>
        </Pressable>
        <Pressable onPress={onOpen} style={{ marginRight: 14 }}>
          <Text style={{ color: Colors.subtext }}>💬 {post.commentCount}</Text>
        </Pressable>
        <Pressable onPress={onSave} style={{ marginRight: 14 }}>
          <Text style={{ color: post.saved ? Colors.primary : Colors.subtext }}>
            🔖
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ color: Colors.subtext }}>📤</Text>
      </View>
    </View>
  );
};
