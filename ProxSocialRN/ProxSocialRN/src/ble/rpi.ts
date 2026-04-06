import { v4 as uuidv4 } from 'uuid';
import { RPI_ROTATE_MS } from './constants';

// MVP: RPI aleatorio que rota. En producción: derivar de secret del dispositivo (HMAC) para consistencia controlada.
let current = '';
let nextRotate = 0;

export function currentRpi(): string {
  const now = Date.now();
  if (!current || now >= nextRotate) {
    current = uuidv4().replace(/-/g, '').slice(0, 16); // hex-ish
    nextRotate = now + RPI_ROTATE_MS;
  }
  return current;
}
