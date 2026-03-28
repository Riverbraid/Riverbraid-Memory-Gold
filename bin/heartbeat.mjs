import { createHash } from 'crypto';

const PREDICTIONS = [
  { id: 'P1', name: 'Coherence Primacy', test: (m) => !(m.mode === 'engage' && m.coherence < m.novelty) },
  { id: 'P2', name: 'Fail-Closed on Load', test: (m) => !(m.systemic_load >= 0.85 && m.mode !== 'rest') },
  { id: 'P3', name: 'Entropy Non-Escalation', test: (m) => m.pattern_disruption <= m.interaction_variance + 0.001 },
  { id: 'P4', name: 'Boundary Proportionality', test: (m) => typeof m.boundary_violation_score === 'undefined' || m.boundary_violation_score <= m.interaction_variance + 0.1 },
  { id: 'P5', name: 'Determinism', test: (m, prior) => !prior || m.AUDIT_HASH === prior },
  { id: 'P6', name: 'Coherence Scaling', test: (m) => (m.coherence >= 0.8 && m.interaction_variance <= 0.2) ? m.coherence_confidence >= 0.6 : true },
  { id: 'P7', name: 'No Silent State', test: (m) => typeof m.mode === 'string' && typeof m.AUDIT_HASH === 'string' }
];

export function pulse(metrics, priorHash = null) {
  const results = PREDICTIONS.map(p => {
    let passed; try { passed = p.test(metrics, priorHash); } catch (e) { passed = false; }
    return { id: p.id, name: p.name, passed };
  });
  const allPassed = results.every(r => r.passed);
  const heartbeat = { 
    timestamp_iso: new Date().toISOString(), 
    all_passed: allPassed, 
    signal: allPassed ? 'CLOSED-LOOP' : 'FAIL-CLOSED',
    AUDIT_HASH: metrics.AUDIT_HASH 
  };
  heartbeat.HEARTBEAT_HASH = createHash('sha256').update(JSON.stringify(heartbeat)).digest('hex').slice(0, 16);
  return heartbeat;
}

export function assertPulse(metrics, priorHash = null) {
  const hb = pulse(metrics, priorHash);
  if (!hb.all_passed) throw new Error('HEARTBEAT FAIL-CLOSED');
  return hb;
}
