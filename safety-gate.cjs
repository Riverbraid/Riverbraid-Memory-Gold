#!/usr/bin/env node
/**
 * Riverbraid Safety Gate
 * Purpose: Predicate-based boundary enforcement.
 */
const refusal = require("./refusal-engine.cjs");
const { logProof } = require("./proof-scaffold.cjs");

function evaluateSafety(intent) {
    console.log("→ Evaluating Intent Safety...");
    
    if (refusal.shouldRefuse(intent)) {
        logProof('SAFETY_GATE_BLOCKED', true, { intent });
        refusal.executeHalt(`Intent [${intent}] violates Go 44 safety constraints.`);
    }

    logProof('SAFETY_GATE_PASSED', true, { intent });
    return true;
}

module.exports = { evaluateSafety };
