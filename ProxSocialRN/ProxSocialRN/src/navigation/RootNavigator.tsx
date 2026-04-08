import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import PostDetailScreen from '../screens/PostDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { useAuthStore } from '../store/useAuthStore';
import { NearbyUser } from '../types/models';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  PostDetail: { postId: string };
  UserDetail: { userId?: string; nearbyUser?: NearbyUser };
  Chat: { conversationId: string; otherName: string };
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Comentarios' }} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'Perfil' }} />
          <Stack.Screen name="Chat" component={ChatScreen}
            options={({ route }: any) => ({ title: route.params?.otherName || 'Chat' })} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
