import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { C } from '../theme';
import { useAuth } from '../store';
import { RootStackParamList } from './types';
import Tabs from './Tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Root() {
  const token = useAuth((s) => s.token);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: C.paper },
        headerTintColor: C.ink,
        headerTitleStyle: { fontWeight: '700' },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: C.paper },
      }}
    >
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Publicación' }} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.name })} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil', presentation: 'modal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
