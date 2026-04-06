import { BleManager, Device } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { bucketize, estimateDistanceMeters } from './distance';
import { SERVICE_UUID, STALE_TTL_MS } from './constants';
import { currentRpi } from './rpi';
import { startAdvertising, stopAdvertising } from './native/ProxBleAdvertiser';
import { hashToAngleDeg } from '../utils/hash';
import { EMA } from './ema';
import { useProximityStore } from '../store/useProximityStore';
import { TAGS } from '../mock/mockTags';
import { bytesToHex } from './hex';

// NOTE: este servicio asume que el módulo nativo anuncia manufacturerData con el RPI.
// Para evitar “tracking” no deseado, aquí filtramos por SERVICE_UUID.

type PeerState = {
  ema: EMA;
};

export class ProxBleService {
  private manager = new BleManager();
  private scanning = false;
  private peerState = new Map<string, PeerState>(); // key: rpi
  private cleanupTimer: any = null;

  async start() {
    const { visible, scanning } = useProximityStore.getState();
    if (this.scanning) return;

    if (visible) {
      // Advertise RPI actual
      const rpi = currentRpi();
      await startAdvertising(SERVICE_UUID, rpi);
    }

    if (scanning) {
      this.startScan();
      this.cleanupTimer = setInterval(() => {
        useProximityStore.getState().removeStale(STALE_TTL_MS);
      }, 2000);
    }
  }

  async stop() {
    try {
      this.manager.stopDeviceScan();
    } catch {}
    try {
      await stopAdvertising();
    } catch {}
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupTimer = null;
    this.scanning = false;
  }

  private startScan() {
    this.scanning = true;
    this.manager.startDeviceScan([SERVICE_UUID], { allowDuplicates: true }, (error, device) => {
      if (error) {
        console.warn('[BLE] scan error', error);
        return;
      }
      if (!device) return;
      this.onDevice(device);
    });
  }

  private onDevice(device: Device) {
    // manufacturerData viene base64 en ble-plx
    const rpi = extractRpiFromDevice(device);
    if (!rpi) return;

    const rssi = device.rssi ?? -100;
    const dRaw = estimateDistanceMeters(rssi);
    const state = this.peerState.get(rpi) ?? { ema: new EMA(0.35) };
    this.peerState.set(rpi, state);
    const d = clamp(state.ema.update(dRaw), 0, 7);

    const bucket = bucketize(d);
    if (bucket === 'OUT') return;

    // En un producto real, aquí resolverías el RPI -> perfil “peek” con backend.
    const displayName = `Usuario ${rpi.slice(0, 4).toUpperCase()}`;
    const avatarSeed = rpi.slice(0, 6);
    const tags = pickTags(rpi);

    useProximityStore.getState().upsertNearby({
      rpi,
      displayName,
      avatarSeed,
      tags,
      distanceM: d,
      angleDeg: hashToAngleDeg(rpi),
      bucket,
      lastSeenAt: Date.now(),
    });
  }
}

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function pickTags(seed: string) {
  const h = hashToAngleDeg(seed);
  // 3 tags deterministas
  return [TAGS[h % TAGS.length], TAGS[(h + 3) % TAGS.length], TAGS[(h + 7) % TAGS.length]];
}

function extractRpiFromDevice(device: Device): string | null {
  // Estrategias:
  // 1) manufacturerData (base64) -> bytes -> hex -> extraer RPI
  //    Nota: en Android, algunos stacks incluyen Company ID (2 bytes) antes del payload.
  // 2) serviceData con clave SERVICE_UUID

  const m = device.manufacturerData;
  if (m) {
    try {
      const bytes = base64ToBytes(m);
      const hex = bytesToHex(bytes);

      // Si vemos el Company ID 0x1234 (endianness variable), saltamos 2 bytes (4 hex chars)
      // Ejemplo: 0x1234 puede aparecer como "1234" o "3412"
      const startsWithCompany = hex.startsWith('1234') || hex.startsWith('3412');
      const start = startsWithCompany ? 4 : 0;

      const candidate = hex.slice(start, start + 16);
      return candidate.length === 16 ? candidate : null;
    } catch {
      return null;
    }
  }

  const sd = device.serviceData;
  if (sd) {
    const anyKey = Object.keys(sd)[0];
    if (anyKey) {
      try {
        const bytes = base64ToBytes(sd[anyKey]);
        const hex = bytesToHex(bytes);
        const candidate = hex.slice(0, 16);
        return candidate.length === 16 ? candidate : null;
      } catch {
        return null;
      }
    }
  }

  return null;
}

// Base64 -> Uint8Array// Base64 -> Uint8Array sin Buffer
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function base64ToBytes(b64: string): Uint8Array {
  let clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  let output: number[] = [];
  let i = 0;
  while (i < clean.length) {
    const enc1 = B64.indexOf(clean.charAt(i++));
    const enc2 = B64.indexOf(clean.charAt(i++));
    const enc3 = B64.indexOf(clean.charAt(i++));
    const enc4 = B64.indexOf(clean.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output.push(chr1);
    if (enc3 !== 64) output.push(chr2);
    if (enc4 !== 64) output.push(chr3);
  }
  return new Uint8Array(output);
}
