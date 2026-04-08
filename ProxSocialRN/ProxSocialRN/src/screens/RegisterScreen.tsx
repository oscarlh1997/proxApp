import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRegister = async () => {
    if (!username || !email || !password) return Alert.alert('Error', 'Rellena los campos obligatorios');
    setLoading(true);
    try {
      const data = await api.register({ username, email, password, displayName: displayName || username });
      setAuth(data.token, data.user.id, data.user.username);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 24 }}>Crear cuenta</Text>

      <TextInput placeholder="Username *" placeholderTextColor={Colors.subtext} value={username} onChangeText={setUsername} autoCapitalize="none"
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 12 }} />
      <TextInput placeholder="Nombre para mostrar" placeholderTextColor={Colors.subtext} value={displayName} onChangeText={setDisplayName}
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 12 }} />
      <TextInput placeholder="Email *" placeholderTextColor={Colors.subtext} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 12 }} />
      <TextInput placeholder="Contraseña *" placeholderTextColor={Colors.subtext} value={password} onChangeText={setPassword} secureTextEntry
        style={{ backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, color: Colors.text, marginBottom: 20 }} />

      <Pressable onPress={handleRegister} disabled={loading}
        style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Registrarse</Text>}
      </Pressable>

      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={{ color: Colors.primary }}>Ya tengo cuenta</Text>
      </Pressable>
    </View>
  );
}
