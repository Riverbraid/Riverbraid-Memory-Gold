/**
 * Riverbraid-Memory-Gold: index.js
 * Meaning-Centric Persistence (v1.3.0)
 */

export const RB_PETAL_ID = 'Riverbraid-Memory-Gold';

export function record(key, content) {
  if (typeof key !== 'string' || key.trim().length === 0) {
    throw new TypeError('RECORD_ERROR: key must be a non-empty string');
  }
  return { key: key.trim(), content, petal: RB_PETAL_ID };
}

export function recall(key, store) {
  if (!(store instanceof Map)) {
    throw new TypeError('RECALL_ERROR: store must be a Map');
  }
  return store.get(key) ?? null;
}

export function commit(memoryRecord, store) {
  if (!(store instanceof Map)) {
    throw new TypeError('COMMIT_ERROR: store must be a Map');
  }
  if (store.has(memoryRecord.key)) {
    throw new Error(`COMMIT_ERROR: key '${memoryRecord.key}' already exists - records are immutable`);
  }
  store.set(memoryRecord.key, memoryRecord);
}

export function getStatus() {
  return { status: 'STATIONARY', petal: RB_PETAL_ID };
}
