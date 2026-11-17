import React from 'react';
import { Pressable, Text } from 'react-native';
import { C } from '../theme';

/** Etiqueta de interés. Con onPress es seleccionable; sin él, solo informativa. */
export function Chip({ label, selected, onPress, highlight }: {
  label: string; selected?: boolean; onPress?: () => void; highlight?: boolean;
}) {
  const bg = selected ? C.ink : highlight ? C.signalSoft : C.surface;
  const fg = selected ? '#fff' : highlight ? C.signal : C.ink;
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'checkbox' : 'text'}
      accessibilityState={onPress ? { checked: !!selected } : undefined}
      style={{
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
        backgroundColor: bg, borderWidth: 1, borderColor: selected ? C.ink : highlight ? C.signalSoft : C.line,
        marginRight: 6, marginBottom: 6,
      }}
    >
      <Text style={{ color: fg, fontSize: 13, fontWeight: highlight || selected ? '700' : '500' }}>{label}</Text>
    </Pressable>
  );
}
