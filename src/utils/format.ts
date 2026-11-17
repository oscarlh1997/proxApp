import { RelationshipStatus } from '../types';

export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'ahora';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

export const formatDistance = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

export const RELATIONSHIP_LABELS: Record<RelationshipStatus, string> = {
  no_especificado: 'Prefiero no decirlo',
  soltero: 'Soltero',
  soltera: 'Soltera',
  en_relacion: 'En una relación',
  casado: 'Casado',
  casada: 'Casada',
  es_complicado: 'Es complicado',
};

/** Hash FNV-1a: ángulo estable en el radar y color del avatar a partir de un id. */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Acepta "instagram.com/ana" y le añade https://; el backend solo admite http(s). */
export function normalizeUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}
