import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T, distanceColor } from '../theme';
import { NearbyUser } from '../types';
import { formatDistance, RELATIONSHIP_LABELS } from '../utils/format';
import { Avatar } from './Avatar';
import { SocialIcons } from './Social';

/** Persona cercana: lo esencial para decidir si abrir su perfil. */
export function PersonRow({ user, sharedInterests, onPress }: {
  user: NearbyUser; sharedInterests: string[]; onPress: () => void;
}) {
  const status = user.relationshipStatus !== 'no_especificado' ? RELATIONSHIP_LABELS[user.relationshipStatus] : null;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${user.displayName}, a ${formatDistance(user.distanceM)}`}
      style={({ pressed }) => ({
        flexDirection: 'row', gap: 12, paddingVertical: 14, paddingHorizontal: 20,
        backgroundColor: pressed ? C.surface : 'transparent',
      })}
    >
      <Avatar name={user.displayName} seed={user.avatarSeed} size={48} />
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <Text style={[T.name, { flexShrink: 1 }]} numberOfLines={1}>{user.displayName}</Text>
          <Text style={{ color: distanceColor(user.distanceM), fontWeight: '800', fontSize: 13 }}>
            {formatDistance(user.distanceM)}
          </Text>
        </View>
        {user.bio ? <Text style={T.meta} numberOfLines={1}>{user.bio}</Text> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
          {status && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="heart" size={12} color={C.pulse} />
              <Text style={[T.meta, { fontSize: 12 }]}>{status}</Text>
            </View>
          )}
          {sharedInterests.length > 0 && (
            <Text style={{ fontSize: 12, color: C.signal, fontWeight: '700' }} numberOfLines={1}>
              {sharedInterests.length === 1 ? `Os gusta ${sharedInterests[0]}` : `${sharedInterests.length} intereses en común`}
            </Text>
          )}
          <View style={{ flex: 1 }} />
          <SocialIcons links={user.socialLinks} />
        </View>
      </View>
    </Pressable>
  );
}
