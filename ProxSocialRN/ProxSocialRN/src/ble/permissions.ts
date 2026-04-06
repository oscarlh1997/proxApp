import { Platform } from 'react-native';
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const res = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(res).every((v) => v === RESULTS.GRANTED);
  }
  if (Platform.OS === 'ios') {
    // iOS: permisos BLE se gestionan por prompts de uso; no siempre expone “request”.
    // Aun así, pedimos Bluetooth si está disponible en tu versión de RN-permissions.
    const res = await requestMultiple([
      PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    ]);
    return Object.values(res).every((v) => v === RESULTS.GRANTED || v === RESULTS.LIMITED);
  }
  return false;
}
