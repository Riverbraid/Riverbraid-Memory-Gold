/**
 * index.js — Riverbraid Memory-Gold
 * Invariant: MEMORY_SIGNAL_RATIO | Ring: 1
 *
 * Deterministic meaning-centric persistence logic.
 */
export const INVARIANT = "MEMORY_SIGNAL_RATIO";
export const PETAL = "Memory-Gold";
export const RING = 1;

const MEANING_FLOOR = 0.35;
const REDUNDANCY_CEILING = 0.40;
const RING_BUFFER_SIZE = 32;
const _ringBuffer = [];

export function verify(input) {
  if (typeof input?.text !== "string" || input.text.trim().length === 0) {
    return { pass: false, signal: "memory:INVALID", reason: "input.text must be a non-empty string" };
  }
  if (typeof input?.tokens !== "number" || !isFinite(input.tokens) || input.tokens <= 0) {
    return { pass: false, signal: "memory:INVALID", reason: "input.tokens must be a positive finite number" };
  }
  if (input.reset_buffer === true) { _ringBuffer.length = 0; }

  const tokens = Math.floor(input.tokens);
  const words = input.text.trim().split(/\s+/);
  const uniqueWords = new Set(words);
  const ratio = uniqueWords.size / tokens;

  if (ratio < MEANING_FLOOR) {
    return { pass: false, signal: `memory:LOW_DENSITY:ratio=${ratio.toFixed(4)}`, reason: "Density floor failure", ratio };
  }

  const freq = {};
  for (const word of words) { freq[word] = (freq[word] ?? 0) + 1; }
  const maxFreq = Math.max(...Object.values(freq));
  const redundancy = maxFreq / tokens;

  if (redundancy > REDUNDANCY_CEILING) {
    return { pass: false, signal: "memory:REDUNDANT", reason: "Redundancy ceiling failure", ratio };
  }

  const normalized = input.text.trim().toLowerCase();
  if (_ringBuffer.includes(normalized)) {
    return { pass: false, signal: "memory:DUPLICATE", reason: "Duplicate rejection", ratio };
  }

  _ringBuffer.push(normalized);
  if (_ringBuffer.length > RING_BUFFER_SIZE) { _ringBuffer.shift(); }

  return { pass: true, signal: `memory:COMMITTED:ratio=${ratio.toFixed(4)}`, reason: "Signal meets floor", ratio };
}

export function getBufferDepth() { return _ringBuffer.length; }
