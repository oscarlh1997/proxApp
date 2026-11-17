import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../store';
import { C, T } from '../theme';
import { ScreenProps } from '../navigation/types';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/States';

function Mark() {
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56">
      <Circle cx={28} cy={28} r={28} fill={C.ink} />
      <Circle cx={28} cy={28} r={18} stroke={C.radarRing} strokeWidth={2} fill="none" />
      <Circle cx={28} cy={28} r={9} stroke={C.radarRing} strokeWidth={2} fill="none" />
      <Circle cx={39} cy={16} r={5} fill={C.pulse} />
      <Circle cx={28} cy={28} r={3.5} fill="#fff" />
    </Svg>
  );
}

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const setAuth = useAuth((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const login = async (e = email, p = password) => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.login({ email: e.trim(), password: p });
      setAuth(r.token, r.user.id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const demo = async () => {
    setLoading(true);
    setError(null);
    try {
      setInfo((await api.seed()).message);
      await login('ana@test.com', 'test123');
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          <Mark />
          <Text style={[T.display, { fontSize: 40, marginTop: 20 }]}>ProxSocial</Text>
          <Text style={[T.body, { color: C.haze, fontSize: 17, marginTop: 4, marginBottom: 32 }]}>
            Descubre quién tiene tus mismos gustos a unos metros de ti.
          </Text>

          <ErrorBanner message={error} />
          {info && !error ? <Text style={[T.meta, { marginBottom: 12 }]}>{info}</Text> : null}

          <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email"
            keyboardType="email-address" placeholder="tu@email.com" />
          <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password"
            placeholder="Mínimo 6 caracteres" onSubmitEditing={() => login()} />

          <Button title="Entrar" onPress={() => login()} loading={loading} disabled={!email || !password} />
          <Button title="Crear una cuenta" variant="ghost" onPress={() => navigation.navigate('Register')} style={{ marginTop: 8 }} />

          {__DEV__ && (
            <View style={{ marginTop: 32, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 20 }}>
              <Text style={[T.meta, { marginBottom: 10 }]}>
                Modo desarrollo: crea 6 usuarios de prueba (ana, luis, mar, pablo, sara, ivan @test.com, contraseña test123) y entra como Ana.
              </Text>
              <Button title="Entrar con datos de prueba" variant="secondary" icon="flask-outline" onPress={demo} disabled={loading} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
