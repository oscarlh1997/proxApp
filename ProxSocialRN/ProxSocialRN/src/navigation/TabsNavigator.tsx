import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/FeedScreen';
import RadarScreen from '../screens/RadarScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Radar" component={RadarScreen} options={{ title: 'Radar' }} />
      <Tab.Screen name="Mensajes" component={MessagesScreen} options={{ title: 'Mensajes' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
