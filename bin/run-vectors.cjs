const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();

function getSnapshot(dir = ROOT) {
  const files = [];
  function walk(current) {
    const resolved = path.resolve(current);
    
    // INVARIANT: Absolute Path Containment
    if (!resolved.startsWith(ROOT)) return;
    if (!fs.existsSync(resolved)) return;

    const entries = fs.readdirSync(resolved, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(resolved, entry.name);

      // EXCLUSIONS
      if (
        entry.name === '.git' || 
        entry.name === 'node_modules' || 
        entry.name === '.codespaces' || 
        entry.name === 'constitution.snapshot.json'
      ) continue;

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    }
  }
  walk(dir);
  return files.sort();
}

function generateHash() {
  const files = getSnapshot();
  const hasher = crypto.createHash('sha256');
  files.forEach(file => {
    const buf = fs.readFileSync(file);
    if (buf.length > 0 && buf[buf.length - 1] !== 0x0a) {
      throw new Error(`LF_VIOLATION:${path.relative(ROOT, file)}`);
    }
    hasher.update(buf);
  });
  return hasher.digest('hex');
}

const command = process.argv[2];
const snapPath = path.join(ROOT, 'constitution.snapshot.json');

if (command === 'snapshot') {
  const hash = generateHash();
  fs.writeFileSync(snapPath, JSON.stringify({ sha256: hash }, null, 2) + '\n');
  console.log('Snapshot Generated.');
} else if (command === 'verify') {
  const currentHash = generateHash();
  if (!fs.existsSync(snapPath)) throw new Error("Missing snapshot.");
  const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
  if (currentHash !== snap.sha256) throw new Error("CRITICAL: State Drift Detected.");
  console.log('VERIFIED: Floor is Stationary.');
}
