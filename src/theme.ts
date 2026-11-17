import { TextStyle } from 'react-native';

export const C = {
  paper: '#EEF0F7',
  surface: '#FFFFFF',
  ink: '#1B1D3A',
  haze: '#6F7390',
  line: '#D9DCEA',
  signal: '#5B4BFF',
  signalSoft: '#E6E3FF',
  pulse: '#FF4F8B',
  pulseSoft: '#FFE3EE',
  danger: '#C62E4A',
  radarRing: '#34376A',
  radarLabel: '#8B8FC0',
  far: '#9A97D8',
};

export const T: Record<'display' | 'title' | 'name' | 'body' | 'meta' | 'label', TextStyle> = {
  display: { fontSize: 32, fontWeight: '800', letterSpacing: -1, color: C.ink },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: C.ink },
  name: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, color: C.ink },
  body: { fontSize: 15, lineHeight: 21, color: C.ink },
  meta: { fontSize: 13, lineHeight: 18, color: C.haze },
  label: { fontSize: 13, fontWeight: '700', color: C.haze },
};

/** Color de un punto según distancia: cerca (rosa), medio (índigo), lejos (lavanda). */
export const distanceColor = (m: number) => (m <= 50 ? C.pulse : m <= 150 ? C.signal : C.far);
