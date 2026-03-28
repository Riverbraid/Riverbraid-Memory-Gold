const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IGNORE = ['constitution.snapshot.json', '.git', 'node_modules', '.DS_Store'];

function hashFile(file) {
  const content = fs.readFileSync(file);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.sort().forEach(file => {
    if (IGNORE.includes(file)) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({ file: path.relative(process.cwd(), fullPath), hash: hashFile(fullPath) });
    }
  });
  return results;
}

const mode = process.argv[2];
const files = walk(process.cwd());
const manifestHash = crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');

if (mode === 'snapshot') {
  fs.writeFileSync('constitution.snapshot.json', JSON.stringify({ sha256: manifestHash, files }, null, 2));
  console.log('Snapshot Generated: ' + manifestHash);
} else if (mode === 'verify') {
  const snap = JSON.parse(fs.readFileSync('constitution.snapshot.json'));
  if (manifestHash !== snap.sha256) {
    console.error('Actual:', manifestHash);
    console.error('Expected:', snap.sha256);
    throw new Error("CRITICAL: State Drift Detected.");
  }
  console.log('Verification Success: ' + manifestHash);
}
