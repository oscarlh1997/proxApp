import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../store';
import { C, T } from '../theme';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/States';

export default function RegisterScreen() {
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.register({
        username: form.username.trim().toLowerCase(),
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim() || undefined,
      });
      setAuth(r.token, r.user.id);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Text style={T.display}>Crea tu cuenta</Text>
        <Text style={[T.meta, { fontSize: 15, marginTop: 4, marginBottom: 24 }]}>
          Después podrás añadir tus intereses y tus otras redes.
        </Text>
        <ErrorBanner message={error} />
        <Field label="Nombre" value={form.displayName} onChangeText={set('displayName')} placeholder="Cómo te verán los demás" />
        <Field label="Usuario" value={form.username} onChangeText={set('username')} autoCapitalize="none"
          placeholder="ana_garcia" hint="Letras, números, punto y guion bajo." />
        <Field label="Email" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Field label="Contraseña" value={form.password} onChangeText={set('password')} secureTextEntry hint="Mínimo 6 caracteres." />
        <Button title="Crear cuenta" onPress={submit} loading={loading}
          disabled={!form.username || !form.email || form.password.length < 6} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
