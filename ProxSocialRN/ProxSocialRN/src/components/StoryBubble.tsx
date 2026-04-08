import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { Colors } from '../theme/colors';

export const StoryBubble: React.FC<{
  userName: string;
  seed: string;
  seen: boolean;
  onPress: () => void;
}> = ({ userName, seed, seen, onPress }) => (
  <Pressable onPress={onPress} style={{ width: 72, alignItems: 'center', marginRight: 10 }}>
    <View
      style={{
        padding: 2,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: seen ? Colors.border : Colors.primary,
      }}
    >
      <Avatar seed={seed} size={56} />
    </View>
    <Text numberOfLines={1} style={{ marginTop: 6, fontSize: 12, color: Colors.subtext }}>
      {userName}
    </Text>
  </Pressable>
);
