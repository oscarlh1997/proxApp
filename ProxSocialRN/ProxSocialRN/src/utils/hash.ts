// Hash simple para derivar un ángulo estable (cosmético) a partir de un string.
export function hashToAngleDeg(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 360;
}
