// Riverbraid-Memory-Gold  Thermodynamic Signal
// 7-bit ASCII only.

export const shouldPersist = (entropy) => {
  const THRESHOLD = 0.5;
  return entropy < THRESHOLD;
};
