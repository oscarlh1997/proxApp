import { PATH_LOSS_N, TX_POWER_AT_1M } from './constants';

export function estimateDistanceMeters(rssi: number, txPowerAt1m = TX_POWER_AT_1M, n = PATH_LOSS_N): number {
  // d ≈ 10^((Tx1m − RSSI)/(10·n))
  return Math.pow(10, (txPowerAt1m - rssi) / (10 * n));
}

export function bucketize(d: number): 'NEAR'|'MID'|'FAR'|'OUT' {
  if (d <= 1.5) return 'NEAR';
  if (d <= 3.0) return 'MID';
  if (d <= 6.0) return 'FAR';
  return 'OUT';
}
