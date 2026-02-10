import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
    const readmePath = join(__dirname, 'README.md');
    const readme = readFileSync(readmePath, 'utf8');
    
    // Check for the universal signal marker we injected
    if (readme.includes('[Signal:')) {
        console.log("✅ Stationary State Verified.");
        process.exit(0);
    } else {
        console.error("❌ Invariant Drift: Signal missing in README.");
        process.exit(1);
    }
} catch (e) {
    console.error(`❌ Execution Error: ${e.message}`);
    process.exit(1);
}
