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
    fs.readdirSync(dir).forEach(name => {
      const fullPath = path.join(dir, name);
      const stats = fs.statSync(fullPath);
      const label = path.relative(root, fullPath);

      // SCOPE GATE: Ignore hidden files, assets, and node_modules
      if (name.startsWith('.') || name === 'assets' || name === 'node_modules' || name === 'dist') return;

      if (stats.isDirectory()) {
        walk(fullPath);
      } else {
        // EXTENSION GATE: Only check text-based source/config files
        if (!label.match(/\.(cjs|json|md|txt|js|yaml|yml)$/)) return;
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
if (cmd === 'snapshot') {
  const snap = getSnapshot(process.cwd());
  fs.writeFileSync('constitution.snapshot.json', JSON.stringify(snap, null, 2) + '\n');
  console.log('Snapshot written.');
} else if (cmd === 'verify') {
  const current = getSnapshot(process.cwd());
  const saved = JSON.parse(fs.readFileSync('constitution.snapshot.json', 'utf8'));
  if (JSON.stringify(current) !== JSON.stringify(saved)) throw new Error('INTEGRITY_DRIFT');
  console.log('[OK] Byte-floor clean.');
}
