import { readFileSync } from 'fs';
const state = JSON.parse(readFileSync('./memory.state', 'utf8'));
if (state.principle === "RULE_AND_ANCHOR") {
    console.log("✅ Memory-Gold Invariant Verified: Meaning is primary.");
} else {
    process.exit(1);
}
