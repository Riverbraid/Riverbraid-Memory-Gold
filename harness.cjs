#!/usr/bin/env node
/**
 * Riverbraid Harness
 * Purpose: Protecting the internal frequency during external interaction.
 */
const { evaluateSafety } = require("./safety-gate.cjs");
const { reportMetrics } = require("./profiler.cjs");
const { logProof } = require("./proof-scaffold.cjs");

async function execute(taskName, logic) {
    console.log(`--- Harness: Initiating [${taskName}] ---`);
    
    // 1. Safety Check
    evaluateSafety(taskName);

    try {
        // 2. Execution
        const result = await logic();
        
        // 3. Telemetry
        reportMetrics(taskName);
        logProof('HARNESS_EXECUTION_SUCCESS', true, { taskName });
        
        return result;
    } catch (error) {
        logProof('HARNESS_EXECUTION_FAILURE', false, { taskName, error: error.message });
        throw error;
    }
}

module.exports = { execute };
