import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ProximityBootstrap } from './src/ble/ProximityBootstrap';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ProximityBootstrap>
          <RootNavigator />
        </ProximityBootstrap>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
