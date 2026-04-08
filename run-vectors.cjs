const fs = require('fs');
const path = require('path');

const checkFloor = (label, buf) => {
  if (buf.length === 0 || buf[buf.length - 1] !== 0x0a) throw new Error(`LF_VIOLATION:${label}`);
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if ((b < 32 && b !== 9 && b !== 10 && b !== 13) || b > 126) throw new Error(`ILLEGAL_BYTE:${label}:${i}`);
  }
};

const getSnapshot = (root) => {
  const snapshot = {};
  const walk = (dir) => {
    const files = fs.readdirSync(dir).sort();
    files.forEach(name => {
      const fullPath = path.join(dir, name);
      const stats = fs.statSync(fullPath);
      const label = path.relative(root, fullPath);

      if (name.startsWith('.') || name === 'assets' || name === 'node_modules' || name === 'dist') return;

      if (stats.isDirectory()) {
        walk(fullPath);
      } else {
        if (!label.match(/\.(cjs|json|md|txt|js|yaml|yml)$/)) return;
        if (label === 'constitution.snapshot.json') return; // Don't snapshot the snapshot
        const buf = fs.readFileSync(fullPath);
        checkFloor(label, buf);
        snapshot[label] = buf.toString('hex');
      }
    });
  };
  walk(root);
  return snapshot;
};

const cmd = process.argv[2];
const SNAPSHOT_FILE = 'constitution.snapshot.json';

if (cmd === 'snapshot') {
  const snap = getSnapshot(process.cwd());
  const output = JSON.stringify(snap, Object.keys(snap).sort(), 2) + '\n';
  fs.writeFileSync(SNAPSHOT_FILE, output);
  console.log('Snapshot written.');
} else if (cmd === 'verify') {
  const current = getSnapshot(process.cwd());
  const saved = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
  
  const currentStr = JSON.stringify(current, Object.keys(current).sort(), 2);
  const savedStr = JSON.stringify(saved, Object.keys(saved).sort(), 2);
  
  if (currentStr !== savedStr) {
    console.error('INTEGRITY_DRIFT DETECTED');
    process.exit(1);
  }
  console.log('[OK] Byte-floor clean.');
}
