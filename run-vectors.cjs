const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const constitution = JSON.parse(fs.readFileSync('constitution.threshold.json', 'utf8'));
const verifierContent = fs.readFileSync(__filename, 'utf8');
const computedHash = crypto.createHash('sha256').update(verifierContent).digest('hex');

if (constitution.verifier_integrity !== computedHash) {
    console.error('VERIFIER_INTEGRITY_MISMATCH');
    console.error(`Expected: ${constitution.verifier_integrity}`);
    console.error(`Actual:   ${computedHash}`);
    process.exit(1);
}

if (constitution.threshold !== 1) {
    console.error('THRESHOLD_ERROR: Must be 1 for Solo Genesis.');
    process.exit(1);
}

try {
    const vmPath = '../Riverbraid-Core/Go44/riverbraid_vm';
    execSync(`${vmPath} --verify constitution.threshold.json`);
    console.log("Integrity: Verifier is coupled. ✅");
    console.log("Semantic Bridge: Scale Separation Active. ✅");
    console.log("Stationary Floor (v3.0.0): ✅");
} catch (e) {
    console.error("COUPLING_VIOLATION: VM Rejected the current state.");
    process.exit(1);
}
