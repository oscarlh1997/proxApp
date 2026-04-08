import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { SocketProvider } from './src/components/SocketProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SocketProvider>
          <RootNavigator />
        </SocketProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
