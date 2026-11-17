import React from 'react';
import { Text, View } from 'react-native';
import { hash, initials } from '../utils/format';

// Tonos de la misma luminosidad para que ningún avatar destaque sobre otro
const PALETTE = ['#5B4BFF', '#FF4F8B', '#0F9D8A', '#E8833A', '#2F80ED', '#9B51E0'];

/** Avatar local con iniciales: sin depender de un servicio de imágenes externo. */
export function Avatar({ name, seed, size = 44 }: { name: string; seed: string; size?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: PALETTE[hash(seed || name) % PALETTE.length],
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.38, letterSpacing: -0.5 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
