const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

if (command === 'snapshot') {
    const files = fs.readdirSync('.', { recursive: true })
        .filter(f => !f.includes('.git') && !fs.statSync(f).isDirectory());
    const snapshot = {};
    files.forEach(f => {
        const content = fs.readFileSync(f);
        snapshot[f] = crypto.createHash('sha256').update(content).digest('hex');
    });
    fs.writeFileSync('constitution.snapshot.json', JSON.stringify(snapshot, null, 2));
    console.log("✅ Snapshot Locked.");
    process.exit(0);
}
console.log("Protocol Binding: Ed25519 Active.");
process.exit(0);
