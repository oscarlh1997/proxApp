// UUID de servicio que anuncia la app (filtra para evitar escanear todo el universo BLE)
export const SERVICE_UUID = '0000FEED-0000-1000-8000-00805F9B34FB';

// Estimación distancia BLE (aprox)
export const TX_POWER_AT_1M = -59; // calibrar por modelo
export const PATH_LOSS_N = 2.0;     // ~1.8-2.2 en interior

// Buckets (m)
export const BUCKET_NEAR = 1.5;
export const BUCKET_MID = 3.0;
export const BUCKET_FAR = 6.0;

// Stale TTL (ms) para “desaparecer del radar”
export const STALE_TTL_MS = 25_000;

// RPI rotate
export const RPI_ROTATE_MS = 15 * 60 * 1000;
