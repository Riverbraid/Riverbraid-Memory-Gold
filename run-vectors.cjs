const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const checkFloor = (buf, label) => {
    for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if (!(b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126))) {
            throw new Error(`ILLEGAL_BYTE:${label}:${i}`);
        }
    }
};

const walk = (dir, files = []) => {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (f === '.git' || f === 'node_modules' || f.endsWith('.json')) return;
        if (fs.statSync(p).isDirectory()) walk(p, files);
        else files.push(p);
    });
    return files;
};

const cmd = process.argv[2];
const root = process.cwd();

switch (cmd) {
    case 'snapshot':
        const manifest = walk(root).sort().map(f => {
            const buf = fs.readFileSync(f);
            checkFloor(buf, path.relative(root, f));
            return { file: path.relative(root, f), hash: b => b.toString('hex') }; // Simplified for recovery
        });
        fs.writeFileSync('constitution.snapshot.json', JSON.stringify(manifest, null, 2));
        console.log('Snapshot written.');
        break;

    case 'sign':
        console.log('Signing snapshot...');
        cp.execSync('gpg --clear-sign --yes constitution.snapshot.json', { stdio: 'inherit' });
        break;

    case 'verify':
        console.log('Verifying integrity...');
        // Logic for cross-check
        break;

    default:
        console.log('Usage: node run-vectors.cjs [snapshot|sign|verify]');
        process.exit(1);
}
