import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { NearbyUser } from '../types/models';
import { Avatar } from './Avatar';
import { TagChip } from './TagChip';

const STATUS_EMOJI: Record<string, string> = {
  soltero: '💚', soltera: '💚', en_relacion: '❤️', casado: '💍', casada: '💍', es_complicado: '💛',
};

export const NearbyUserCard: React.FC<{
  user: NearbyUser;
  onConnect?: () => void;
}> = ({ user, onConnect }) => {
  const tags = user.interests || user.tags || [];
  const statusEmoji = STATUS_EMOJI[user.relationshipStatus || ''] || '';

  return (
    <Pressable onPress={onConnect}
      style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar seed={user.avatarSeed} size={44} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: Colors.text, fontWeight: '700' }}>
            {user.displayName} {statusEmoji}
          </Text>
          <Text style={{ color: Colors.subtext }}>
            ~{user.distanceM < 1 ? '<1' : Math.round(user.distanceM)} m
            {user.bio ? ` · ${user.bio.slice(0, 40)}${user.bio.length > 40 ? '…' : ''}` : ''}
          </Text>
        </View>
        <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>Ver</Text>
        </View>
      </View>

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
          {tags.slice(0, 4).map((t) => <TagChip key={t} label={t} />)}
        </View>
      )}

      {/* Social links preview */}
      {user.socialLinks && user.socialLinks.length > 0 && (
        <View style={{ flexDirection: 'row', marginTop: 6, gap: 8 }}>
          {user.socialLinks.slice(0, 3).map((l, i) => (
            <View key={i} style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: Colors.subtext, fontSize: 11, textTransform: 'capitalize' }}>{l.platform}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
};
