const fs = require('fs');
const LOG_PATH = '/workspaces/Riverbraid-Memory-Gold/swarm.ledger.jsonl';

const entry = {
    timestamp: new Date().toISOString(),
    event: process.argv[2],
    status: process.argv[3],
    metadata: process.argv[4] || {}
};

fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
console.log(`[MEMORY] Event recorded: ${entry.event}`);
