import React from 'react';
import { FlatList, View } from 'react-native';
import { StoryBubble } from './StoryBubble';
import { Story } from '../types/models';

export const StoriesBar: React.FC<{
  stories: Story[];
  onPressStory: (id: string) => void;
}> = ({ stories, onPressStory }) => (
  <View style={{ paddingVertical: 10 }}>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={stories}
      keyExtractor={(s) => s.id}
      renderItem={({ item }) => (
        <StoryBubble
          userName={item.userName}
          seed={item.avatarSeed}
          seen={item.seen}
          onPress={() => onPressStory(item.id)}
        />
      )}
    />
  </View>
);
