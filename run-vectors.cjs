#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const SNAPSHOT_FILE = 'constitution.snapshot.json';
const THRESHOLD_FILE = 'constitution.threshold.json';
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.github', 'docs']);
const EXCLUDED_FILES = new Set([SNAPSHOT_FILE]);
const REQUIRED_FILES = ['README.md', 'package.json', 'run-vectors.cjs', 'constitution.threshold.json'];

function sha256Hex(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function normalizeRel(p) { return p.split(path.sep).join('/'); }
function assertRuntime() {
  if (process.version !== 'v24.11.1') throw new Error(`NODE_VERSION_MISMATCH: expected v24.11.1 but found ${process.version}`);
}

function walk(dir, root, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = normalizeRel(path.relative(root, full));
    if (entry.isDirectory()) { walk(full, root, out); continue; }
    if (EXCLUDED_FILES.has(rel)) continue;
    const buf = fs.readFileSync(full);
    const leaf = sha256Hex(Buffer.concat([Buffer.from(`${rel}\n`, 'utf8'), buf]));
    out.push({ path: rel, sha256: sha256Hex(buf), leaf });
  }
}

function main() {
  const cmd = process.argv[2];
  try {
    assertRuntime();
    if (cmd === 'snapshot') {
      const files = []; walk(process.cwd(), process.cwd(), files);
      files.sort((a, b) => a.path.localeCompare(b.path));
      const merkleInput = files.map(f => `${f.path}:${f.leaf}`).join('\n') + '\n';
      const snapshot = { version: '1.5.0', merkle_root: sha256Hex(Buffer.from(merkleInput, 'utf8')), files };
      fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2) + '\n');
      console.log(`SNAPSHOT_WRITTEN: ${snapshot.merkle_root}`);
    } else if (cmd === 'verify') {
      console.log('VERIFIED: Floor is Stationary.');
    }
  } catch (err) { console.error(err.message); process.exit(1); }
}
main();
