import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StoriesBar } from '../components/StoriesBar';
import { PostCard } from '../components/PostCard';
import { Colors } from '../theme/colors';
import { useFeedStore } from '../store/useFeedStore';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProximityStore } from '../store/useProximityStore';
import { NearbyUserCard } from '../components/NearbyUserCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function FeedScreen() {
  const nav = useNavigation<Nav>();
  const { stories, posts, markStorySeen, toggleLike, toggleSave } = useFeedStore();
  const nearby = useProximityStore((s) => s.nearby);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>Stories</Text>
      <StoriesBar stories={stories} onPressStory={(id) => markStorySeen(id)} />

      {nearby.length > 0 && (
        <View style={{ marginTop: 8, marginBottom: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>Cerca de ti</Text>
          <Text style={{ color: Colors.subtext, marginTop: 4 }}>
            Personas detectadas por BLE (con consentimiento).
          </Text>
          <View style={{ marginTop: 10 }}>
            {nearby.slice(0, 2).map((u) => (
              <NearbyUserCard key={u.rpi} user={u} onConnect={() => {}} />
            ))}
          </View>
        </View>
      )}

      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 8 }}>Feed</Text>
      <View style={{ marginTop: 10 }}>
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onOpen={() => nav.navigate('PostDetail', { postId: p.id })}
            onLike={() => toggleLike(p.id)}
            onSave={() => toggleSave(p.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
