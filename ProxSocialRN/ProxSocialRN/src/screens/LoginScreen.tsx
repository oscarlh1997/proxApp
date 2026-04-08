import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Rellena todos los campos');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setAuth(data.token, data.user.id, data.user.username);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Credenciales inválidas');
    } finally { setLoading(false); }
  };

  const handleSeed = async () => {
    try { await api.seed(); Alert.alert('OK', 'Datos de prueba creados. Usa email: ana@test.com / pass: test123'); }
    catch (e: any) { Alert.alert('Info', e.message); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: Colors.text, textAlign: 'center' }}>ProxSocial</Text>
      <Text style={{ color: Colors.subtext, textAlign: 'center', marginTop: 8, marginBottom: 32 }}>
        Descubre quién está a tu alrededor
      </Text>

      <TextInput placeholder="Email" placeholderTextColor={Colors.subtext} value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address"
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 12 }} />
      <TextInput placeholder="Contraseña" placeholderTextColor={Colors.subtext} value={password} onChangeText={setPassword}
        secureTextEntry
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 20 }} />

      <Pressable onPress={handleLogin} disabled={loading}
        style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Entrar</Text>}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={{ color: Colors.primary }}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>

      <Pressable onPress={handleSeed} style={{ marginTop: 24, alignItems: 'center', padding: 12, backgroundColor: '#EEF2FF', borderRadius: 12 }}>
        <Text style={{ color: Colors.subtext, fontSize: 13 }}>Crear datos de prueba (seed)</Text>
      </Pressable>
    </View>
  );
}
