import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export const TagChip: React.FC<{ label: string }> = ({ label }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: '#F8FAFC',
      marginRight: 6,
      marginTop: 6,
    }}
  >
    <Text style={{ color: Colors.subtext, fontSize: 12 }}>#{label}</Text>
  </View>
);
