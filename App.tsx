import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Root from './src/navigation/Root';
import { Loading } from './src/components/States';
import { useAuth } from './src/store';
import { connectSocket, disconnectSocket } from './src/api/socket';
import { C } from './src/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: C.paper, primary: C.signal, text: C.ink, card: C.paper, border: C.line },
};

export default function App() {
  const { token, hydrated } = useAuth();

  // Un socket por sesión: se abre al entrar y se cierra al salir
  useEffect(() => {
    if (!token) return;
    connectSocket(token);
    return disconnectSocket;
  }, [token]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {hydrated ? (
        <NavigationContainer theme={theme}>
          <Root />
        </NavigationContainer>
      ) : (
        <Loading />
      )}
    </SafeAreaProvider>
  );
}
