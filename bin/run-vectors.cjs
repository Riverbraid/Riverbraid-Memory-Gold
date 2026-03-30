const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();

function getSnapshot(dir = ROOT) {
  const files = [];
  function walk(current) {
    const relativeFromRoot = path.relative(ROOT, current);
    if (relativeFromRoot.startsWith('..')) return;

    if (!fs.existsSync(current)) return;
    
    fs.readdirSync(current, { withFileTypes: true }).forEach(entry => {
      const full = path.join(current, entry.name);
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'constitution.snapshot.json') return;

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    });
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
