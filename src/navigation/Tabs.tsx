import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { api } from '../api/client';
import { useMe } from '../store';
import RadarScreen from '../screens/RadarScreen';
import FeedScreen from '../screens/FeedScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Radar: ['radio', 'radio-outline'],
  Feed: ['chatbubbles', 'chatbubbles-outline'],
  Mensajes: ['paper-plane', 'paper-plane-outline'],
  Perfil: ['person-circle', 'person-circle-outline'],
};

export default function Tabs() {
  const setMe = useMe((s) => s.setMe);
  useEffect(() => {
    api.getMe().then(setMe).catch(() => {});
  }, [setMe]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.ink,
        tabBarInactiveTintColor: C.haze,
        tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={focused ? C.signal : color} />
        ),
      })}
    >
      <Tab.Screen name="Radar" component={RadarScreen} options={{ title: 'Cerca' }} />
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Muro' }} />
      <Tab.Screen name="Mensajes" component={MessagesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
