import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { NearbyUser } from '../types/models';

export const RadarSvg: React.FC<{ users: NearbyUser[]; size?: number }> = ({ users, size = 320 }) => {
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const maxD = Math.max(50, ...users.map(u => u.distanceM));

  // Simple sweep animation with JS timer (works everywhere, no Reanimated needed)
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle(a => (a + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const sweepRad = ((angle - 90) * Math.PI) / 180;
  const sweepX2 = cx + r * Math.cos(sweepRad);
  const sweepY2 = cy + r * Math.sin(sweepRad);

  const rings = useMemo(() => {
    return [maxD / 3, maxD * 2 / 3, maxD].map(d => ({ d, r: (d / maxD) * r }));
  }, [maxD, r]);

  const points = useMemo(() => {
    return users.map((u) => {
      const d = Math.min(u.distanceM, maxD);
      const rr = (d / maxD) * r;
      const a = ((u.angleDeg || 0) - 90) * Math.PI / 180;
      const color = u.distanceM <= maxD / 3 ? Colors.near : u.distanceM <= maxD * 2 / 3 ? Colors.mid : Colors.far;
      return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a), color, key: u.id || u.rpi || String(Math.random()) };
    });
  }, [users, cx, cy, r, maxD]);

  return (
    <View style={{ backgroundColor: Colors.radarBg, borderRadius: 999, padding: 10, alignSelf: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} fill={Colors.radarBg} />
        {rings.map((ring, i) => (
          <React.Fragment key={i}>
            <Circle cx={cx} cy={cy} r={ring.r} stroke={Colors.radarRing} strokeWidth={1} fill="none" />
            <SvgText x={cx + 4} y={cy - ring.r + 12} fill={Colors.radarRing} fontSize={10}>
              {Math.round(ring.d)}m
            </SvgText>
          </React.Fragment>
        ))}
        <Line x1={cx} y1={cy} x2={sweepX2} y2={sweepY2} stroke={Colors.near} strokeWidth={2} opacity={0.6} />
        <Circle cx={cx} cy={cy} r={4} fill="white" />
        {points.map((p) => (
          <Circle key={p.key} cx={p.x} cy={p.y} r={6} fill={p.color} stroke="white" strokeWidth={1} />
        ))}
      </Svg>
    </View>
  );
};
