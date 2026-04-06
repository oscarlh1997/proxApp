import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { NearbyUser } from '../types/models';

const AnimatedLine = Animated.createAnimatedComponent(Line);

export const RadarSvg: React.FC<{ users: NearbyUser[]; size?: number }> = ({ users, size = 320 }) => {
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;

  // sweep line rotation (simple)
  const angle = useSharedValue(0);
  React.useEffect(() => {
    angle.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
  }, [angle]);

  const animatedProps = useAnimatedProps(() => {
    const rad = ((angle.value - 90) * Math.PI) / 180;
    const x2 = cx + r * Math.cos(rad);
    const y2 = cy + r * Math.sin(rad);
    return { x2, y2 };
  });

  const points = useMemo(() => {
    return users.map((u) => {
      const d = Math.max(0, Math.min(6, u.distanceM));
      const rr = (d / 6) * r;
      const a = ((u.angleDeg - 90) * Math.PI) / 180;
      const x = cx + rr * Math.cos(a);
      const y = cy + rr * Math.sin(a);
      const color =
        u.bucket === 'NEAR' ? Colors.near : u.bucket === 'MID' ? Colors.mid : Colors.far;
      return { x, y, color, key: u.rpi };
    });
  }, [users, cx, cy, r]);

  return (
    <View
      style={{
        backgroundColor: Colors.radarBg,
        borderRadius: 999,
        padding: 10,
        alignSelf: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} fill={Colors.radarBg} />
        {[1.5, 3, 6].map((m) => (
          <Circle
            key={m}
            cx={cx}
            cy={cy}
            r={(m / 6) * r}
            stroke={Colors.radarRing}
            strokeWidth={1}
            fill="none"
          />
        ))}
        <AnimatedLine
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r}
          stroke={Colors.near}
          strokeWidth={2}
          animatedProps={animatedProps}
        />
        {points.map((p) => (
          <Circle key={p.key} cx={p.x} cy={p.y} r={5} fill={p.color} />
        ))}
      </Svg>
    </View>
  );
};
