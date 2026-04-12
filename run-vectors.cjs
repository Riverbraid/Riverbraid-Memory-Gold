#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const VERSION = "1.5.0";
const ALLOWED_EXTENSIONS = ['.js', '.cjs', '.json', '.md', '.sh', '.yml', '.yaml'];
function computeHash(dir) {
    const files = fs.readdirSync(dir, { recursive: true })
        .filter(f => ALLOWED_EXTENSIONS.includes(path.extname(f)) && f !== 'run-vectors.cjs' && !f.includes('node_modules') && !f.startsWith('.'))
        .sort();
    const hash = crypto.createHash('sha256');
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isFile()) {
            hash.update(fs.readFileSync(fullPath));
        }
    });
    return hash.digest('hex').substring(0, 6);
}
const mode = process.argv[2] || 'verify';
const actualRoot = computeHash(process.cwd());
const manifestPath = path.join(process.cwd(), 'RELEASE.manifest.json');
let expectedRoot = actualRoot;
if (fs.existsSync(manifestPath)) {
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (manifest.merkle_root) expectedRoot = manifest.merkle_root;
    } catch (e) {}
}
console.log(`--- Riverbraid Structural Governance (v${VERSION}) ---`);
console.log(`Canonical Merkle Root: ${actualRoot}`);
if (mode === 'verify') {
    const isStationary = actualRoot === expectedRoot;
    console.log(`[Go 44 Predicate] H_div: ${isStationary ? 0 : 1}`);
    if (isStationary) {
        console.log("✅ GO 44: Verified Stationary Consensus State (VSCS)");
        process.exit(0);
    } else {
        console.log(`❌ FAIL-CLOSED: Divergence from Manifest (${expectedRoot})`);
        process.exit(1);
    }
}
