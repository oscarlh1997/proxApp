import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export default function MessagesScreen() {
  const items = [
    { id: 'c1', name: 'Ana', last: '¿Te apetece un café?' },
    { id: 'c2', name: 'Luis', last: 'Nos vemos en el meetup' },
    { id: 'c3', name: 'Mar', last: 'Te paso el link del evento' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      {items.map((c) => (
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
          <Text style={{ color: Colors.text, fontWeight: '800' }}>{c.name}</Text>
          <Text style={{ color: Colors.subtext, marginTop: 6 }}>{c.last}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
