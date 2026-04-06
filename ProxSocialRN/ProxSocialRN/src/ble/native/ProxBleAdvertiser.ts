import { NativeModules, Platform } from 'react-native';

type ProxBleAdvertiserType = {
  startAdvertising: (serviceUuid: string, manufacturerHex: string) => Promise<void>;
  stopAdvertising: () => Promise<void>;
};

const Native = NativeModules.ProxBleAdvertiser as ProxBleAdvertiserType | undefined;

export async function startAdvertising(serviceUuid: string, manufacturerHex: string) {
  if (!Native) {
    throw new Error('ProxBleAdvertiser native module not linked. See README.');
  }
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    await Native.startAdvertising(serviceUuid, manufacturerHex);
  }
}

export async function stopAdvertising() {
  if (!Native) return;
  await Native.stopAdvertising();
}
