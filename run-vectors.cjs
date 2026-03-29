const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SNAPSHOT = "vectors.manifest.json";
const EXCLUSIONS = [SNAPSHOT, "constitution.snapshot.json", ".git", "node_modules", ".codespaces"];

const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

function getSnapshot() {
  const hashes = [];
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (EXCLUSIONS.includes(file)) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const buf = fs.readFileSync(fullPath);
        hashes.push({
          path: path.relative(process.cwd(), fullPath),
          sha256: sha256(buf)
        });
      }
    }
  }

  walk(process.cwd());
  hashes.sort((a, b) => a.path.localeCompare(b.path));
  
  const clusterData = JSON.stringify(hashes);
  return {
    version: "1.5.0",
    sha256: sha256(Buffer.from(clusterData)),
    files: hashes
  };
}

const cmd = process.argv[2];
if (cmd === "snapshot") {
  fs.writeFileSync(SNAPSHOT, JSON.stringify(getSnapshot(), null, 0) + "\n");
  console.log(" Snapshot Generated.");
} else if (cmd === "verify") {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT));
  const current = getSnapshot();
  if (current.sha256 !== snap.sha256) {
    console.error("CRITICAL: State Drift Detected.");
    process.exit(1);
  }
  console.log(" VERIFIED: Floor is Stationary.");
} else {
  console.log("Usage: node run-vectors.cjs [snapshot|verify]");
  process.exit(1);
}
