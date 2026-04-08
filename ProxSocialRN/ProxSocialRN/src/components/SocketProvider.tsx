import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { connectSocket, disconnectSocket } from '../api/socket';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      try { connectSocket(); } catch {}
    }
    return () => { disconnectSocket(); };
  }, [token]);

  return <>{children}</>;
};
