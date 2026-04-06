import React from 'react';
import { Image, ViewStyle } from 'react-native';

export function avatarUrl(seed: string, size = 64): string {
  // Usamos dicebear (identicon). En producción: servir avatares propios.
  return `https://api.dicebear.com/7.x/identicon/png?seed=${encodeURIComponent(seed)}&size=${size}`;
}

export const Avatar: React.FC<{ seed: string; size?: number; style?: ViewStyle }> = ({
  seed,
  size = 40,
  style,
}) => (
  <Image
    source={{ uri: avatarUrl(seed, Math.round(size * 2)) }}
    style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: '#E5E7EB' },
      style,
    ]}
  />
);
