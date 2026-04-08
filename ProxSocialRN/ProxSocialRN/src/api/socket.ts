import { io, Socket } from 'socket.io-client';
import { WS_URL } from './config';
import { useAuthStore } from '../store/useAuthStore';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  const token = useAuthStore.getState().token;
  if (!token) throw new Error('No auth token');

  socket = io(WS_URL!, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[WS] connected', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[WS] disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[WS] connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function joinConversation(conversationId: string): void {
  socket?.emit('join', { conversationId });
}

export function leaveConversation(conversationId: string): void {
  socket?.emit('leave', { conversationId });
}

export function sendSocketMessage(conversationId: string, text: string): void {
  socket?.emit('message', { conversationId, text });
}
