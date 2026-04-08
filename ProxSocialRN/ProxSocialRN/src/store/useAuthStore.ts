import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  userId: string | null;
  username: string | null;
  setAuth: (token: string, userId: string, username: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, userId: null, username: null,
      setAuth: (token, userId, username) => set({ token, userId, username }),
      logout: () => set({ token: null, userId: null, username: null }),
    }),
    { name: 'prox-auth', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
