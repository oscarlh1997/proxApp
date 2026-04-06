import { create } from 'zustand';
import { NearbyUser } from '../types/models';

type ProximityState = {
  visible: boolean;
  scanning: boolean;
  nearby: NearbyUser[];
  setVisible: (v: boolean) => void;
  setScanning: (v: boolean) => void;
  upsertNearby: (u: NearbyUser) => void;
  removeStale: (ttlMs: number) => void;
  clear: () => void;
};

export const useProximityStore = create<ProximityState>((set, get) => ({
  visible: true,
  scanning: true,
  nearby: [],
  setVisible: (v) => set({ visible: v }),
  setScanning: (v) => set({ scanning: v }),
  upsertNearby: (u) =>
    set((state) => {
      const idx = state.nearby.findIndex((x) => x.rpi === u.rpi);
      if (idx === -1) return { nearby: [u, ...state.nearby].slice(0, 50) };
      const next = [...state.nearby];
      next[idx] = u;
      // sort by distance
      next.sort((a, b) => a.distanceM - b.distanceM);
      return { nearby: next };
    }),
  removeStale: (ttlMs) =>
    set((state) => ({
      nearby: state.nearby.filter((u) => Date.now() - u.lastSeenAt < ttlMs),
    })),
  clear: () => set({ nearby: [] }),
}));
