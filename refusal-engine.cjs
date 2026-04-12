#!/usr/bin/env node
/**
 * Riverbraid Refusal Engine
 * Purpose: Mechanical enforcement of Fail-Closed discipline.
 */
const { logProof } = require("./proof-scaffold.cjs");

class RefusalEngine {
    constructor() {
        this.bans = new Set(['entropy_drift', 'frequency_distortion', 'identity_scattering']);
    }

    shouldRefuse(signal) {
        if (this.bans.has(signal)) {
            logProof('REFUSAL_TRIGGERED', true, { cause: signal });
            return true;
        }
        return false;
    }

    executeHalt(reason) {
        console.error(`❌ FAIL-CLOSED: ${reason}`);
        process.exit(1);
    }
}

module.exports = new RefusalEngine();
