import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import PostDetailScreen from '../screens/PostDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  PostDetail: { postId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Comentarios' }} />
    </Stack.Navigator>
  );
}
