import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { C, distanceColor } from '../theme';
import { NearbyUser } from '../types';
import { hash, initials } from '../utils/format';

// Anillos a 50 / 150 / 500 m repartidos por igual: así quien está muy cerca no queda apelotonado en el centro
const RINGS = [50, 150, 500];
function ringFraction(m: number): number {
  const d = Math.min(m, RINGS[2]);
  if (d <= RINGS[0]) return (d / RINGS[0]) / 3;
  if (d <= RINGS[1]) return 1 / 3 + ((d - RINGS[0]) / (RINGS[1] - RINGS[0])) / 3;
  return 2 / 3 + ((d - RINGS[1]) / (RINGS[2] - RINGS[1])) / 3;
}

const DOT = 30;

/**
 * Ángulo cosmético estable por usuario (el GPS no da orientación fiable entre dos móviles).
 * Si un punto pisa a otro, se gira en pasos de 20° hasta que quede libre.
 */
function placeDots(users: NearbyUser[], c: number, r: number) {
  const placed: { u: NearbyUser; x: number; y: number }[] = [];
  for (const u of users) {
    const rr = ringFraction(u.distanceM) * r;
    let deg = hash(u.id) % 360;
    let x = 0;
    let y = 0;
    for (let i = 0; i < 18; i++, deg += 20) {
      x = c + rr * Math.cos((deg * Math.PI) / 180);
      y = c + rr * Math.sin((deg * Math.PI) / 180);
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > DOT + 2)) break;
    }
    placed.push({ u, x, y });
  }
  return placed;
}

export function Radar({ users, size, onSelect }: {
  users: NearbyUser[]; size: number; onSelect: (u: NearbyUser) => void;
}) {
  const r = size / 2 - DOT / 2 - 4;
  const c = size / 2;
  const spin = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, spin]);

  // Barrido de 60° que termina en las 12 en punto
  const a0 = (-150 * Math.PI) / 180;
  const wedge = `M ${c} ${c} L ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${c} ${c - r} Z`;

  return (
    <View
      accessible
      accessibilityLabel={`Radar: ${users.length} personas cerca`}
      style={{ width: size, height: size, alignSelf: 'center' }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={c} cy={c} r={r + DOT / 2} fill={C.ink} />
        {RINGS.map((_, i) => (
          <Circle key={i} cx={c} cy={c} r={(r * (i + 1)) / 3} stroke={C.radarRing} strokeWidth={1} fill="none" />
        ))}
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', width: size, height: size,
          transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        }}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="sweep" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={C.signal} stopOpacity="0" />
              <Stop offset="1" stopColor={C.signal} stopOpacity="0.45" />
            </LinearGradient>
          </Defs>
          <Path d={wedge} fill="url(#sweep)" />
          <Path d={`M ${c} ${c} L ${c} ${c - r}`} stroke={C.signal} strokeWidth={2} />
        </Svg>
      </Animated.View>

      {RINGS.map((m, i) => (
        <Text
          key={m}
          style={{ position: 'absolute', left: c + 6, top: c - (r * (i + 1)) / 3 + 2, color: C.radarLabel, fontSize: 10 }}
        >
          {m} m
        </Text>
      ))}

      <View style={{ position: 'absolute', left: c - 7, top: c - 7, width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff' }} />

      {placeDots(users, c, r).map(({ u, x, y }) => (
        <Pressable
          key={u.id}
          onPress={() => onSelect(u)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${u.displayName}, a ${u.distanceM} metros`}
          style={{
            position: 'absolute', left: x - DOT / 2, top: y - DOT / 2,
            width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: distanceColor(u.distanceM),
            borderWidth: 2, borderColor: C.ink, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{initials(u.displayName)}</Text>
        </Pressable>
      ))}
    </View>
  );
}
