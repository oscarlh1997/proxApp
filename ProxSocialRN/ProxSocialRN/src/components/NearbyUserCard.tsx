import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { NearbyUser } from '../types/models';
import { Avatar } from './Avatar';
import { TagChip } from './TagChip';

export const NearbyUserCard: React.FC<{
  user: NearbyUser;
  onConnect?: () => void;
}> = ({ user, onConnect }) => {
  return (
    <View
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
        <Avatar seed={user.avatarSeed} size={44} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: Colors.text, fontWeight: '700' }}>{user.displayName}</Text>
          <Text style={{ color: Colors.subtext }}>
            {labelBucket(user.bucket)} · ~{user.distanceM.toFixed(1)} m
          </Text>
        </View>
        <Pressable
          onPress={onConnect}
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Conectar</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
        {user.tags.map((t) => (
          <TagChip key={t} label={t} />
        ))}
      </View>
    </View>
  );
};

function labelBucket(b: NearbyUser['bucket']) {
  switch (b) {
    case 'NEAR':
      return 'muy cerca';
    case 'MID':
      return 'cerca';
    case 'FAR':
      return 'a la vista';
    default:
      return 'fuera';
  }
}
