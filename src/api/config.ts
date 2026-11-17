import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * La IP del backend se deduce sola: es la misma máquina que sirve Metro (Expo).
 * Solo si el backend está en otra máquina, define EXPO_PUBLIC_API_URL (ej. http://192.168.1.45:3001).
 */
function detectHost(): string {
  const hostUri = Constants.expoConfig?.hostUri; // "192.168.1.45:8081" en Expo Go
  if (hostUri) return hostUri.split(':')[0];
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.location.hostname;
  return 'localhost';
}

export const API_BASE = process.env.EXPO_PUBLIC_API_URL || `http://${detectHost()}:3001`;
export const WS_URL = `${API_BASE}/chat`;
