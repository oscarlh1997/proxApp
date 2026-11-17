import { io, Socket } from 'socket.io-client';
import { WS_URL } from './config';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  socket?.disconnect();
  socket = io(WS_URL, { auth: { token }, transports: ['websocket'], reconnectionDelayMax: 5000 });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export const getSocket = () => socket;
