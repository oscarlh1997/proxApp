import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { C, T } from '../theme';

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[T.label, { marginBottom: 6 }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={C.haze}
        {...props}
        style={[
          {
            backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.line,
            paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: C.ink,
          },
          props.multiline && { minHeight: 90, textAlignVertical: 'top' },
          props.style,
        ]}
      />
      {hint ? <Text style={[T.meta, { marginTop: 4 }]}>{hint}</Text> : null}
    </View>
  );
}
