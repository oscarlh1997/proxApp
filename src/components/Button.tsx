import React from 'react';
import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const STYLES: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: C.signal, fg: '#fff' },
  secondary: { bg: C.surface, fg: C.ink, border: C.line },
  ghost: { bg: 'transparent', fg: C.signal },
  danger: { bg: 'transparent', fg: C.danger },
};

export function Button({
  title, onPress, variant = 'primary', loading, disabled, icon, style, compact,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  compact?: boolean;
}) {
  const s = STYLES[variant];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        {
          minHeight: compact ? 38 : 50,
          paddingHorizontal: compact ? 14 : 20,
          borderRadius: 999,
          backgroundColor: s.bg,
          borderWidth: s.border ? 1 : 0,
          borderColor: s.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: off ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={s.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={compact ? 16 : 18} color={s.fg} />}
          <Text style={{ color: s.fg, fontWeight: '700', fontSize: compact ? 14 : 16 }}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
