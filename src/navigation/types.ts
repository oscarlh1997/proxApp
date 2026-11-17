import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NearbyUser, Post } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  PostDetail: { post: Post };
  UserDetail: { userId: string; nearby?: NearbyUser };
  Chat: { conversationId: string; name: string; avatarSeed: string };
  EditProfile: undefined;
};

export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;

declare global {
  // Tipado global de useNavigation()
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
