import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { Colors } from '../theme/colors';
import { Avatar } from '../components/Avatar';
import { TagChip } from '../components/TagChip';
import { useFeedStore } from '../store/useFeedStore';

export default function ProfileScreen() {
  const resetMock = useFeedStore((s) => s.resetMock);

  const interests = ['ML', 'Café', 'Trail', 'Jazz', 'Cloud'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Avatar seed="me" size={64} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: Colors.text }}>Tú</Text>
          <Text style={{ color: Colors.subtext, marginTop: 6 }}>
            Bio breve… (intereses, hobbies, etc.)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
            {interests.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </View>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <View
          style={{
            backgroundColor: Colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: Colors.text }}>Ajustes</Text>

          <Pressable
            onPress={resetMock}
            style={{
              marginTop: 12,
              backgroundColor: '#EEF2FF',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text style={{ color: Colors.text, fontWeight: '800' }}>Resetear feed (mock)</Text>
            <Text style={{ color: Colors.subtext, marginTop: 4 }}>
              Vuelve a generar posts/stories y limpia comentarios.
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
