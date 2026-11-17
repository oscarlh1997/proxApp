import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from '../theme';

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.paper }}>
      <ActivityIndicator color={C.signal} size="large" />
    </View>
  );
}

/** Estado vacío o de error: dice qué pasa y qué hacer. */
export function Empty({ icon, title, text, children }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; text?: string; children?: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 28, gap: 8 }}>
      <Ionicons name={icon} size={34} color={C.haze} />
      <Text style={[T.name, { textAlign: 'center' }]}>{title}</Text>
      {text ? <Text style={[T.meta, { textAlign: 'center' }]}>{text}</Text> : null}
      {children ? <View style={{ marginTop: 10, alignSelf: 'stretch' }}>{children}</View> : null}
    </View>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View accessibilityRole="alert" style={{ backgroundColor: C.pulseSoft, borderRadius: 12, padding: 12, marginBottom: 16 }}>
      <Text style={{ color: C.danger, fontSize: 14 }}>{message}</Text>
    </View>
  );
}
