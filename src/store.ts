import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  userId: string | null;
  hydrated: boolean;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      hydrated: false,
      setAuth: (token, userId) => set({ token, userId }),
      logout: () => set({ token: null, userId: null }),
    }),
    {
      name: 'prox-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ token: s.token, userId: s.userId }),
      // Evita el parpadeo del login mientras se lee la sesión guardada
      onRehydrateStorage: () => () => useAuth.setState({ hydrated: true }),
    },
  ),
);

/** Mi perfil en memoria: lo usan el radar y otros perfiles para marcar intereses en común. */
type MeState = { me: import('./types').UserProfile | null; setMe: (me: MeState['me']) => void };
export const useMe = create<MeState>()((set) => ({ me: null, setMe: (me) => set({ me }) }));
