// ═══════════════════════════════════════════════════════════════════════════════
// IMPORTANTE: Cambia YOUR_PC_IP por la IP local de tu ordenador.
// En Windows: abre cmd y escribe "ipconfig" → busca "IPv4 Address"
// Ejemplo: 192.168.1.45
// ═══════════════════════════════════════════════════════════════════════════════
const YOUR_PC_IP = '192.168.1.130'; // ← CAMBIA ESTO

export const API_BASE = `http://${YOUR_PC_IP}:3001`;
export const WS_URL = `http://${YOUR_PC_IP}:3001/chat`;
