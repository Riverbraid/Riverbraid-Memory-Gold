#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const GOVERNED = [
  "Riverbraid-Core", "Riverbraid-Golds", "Riverbraid-Crypto-Gold",
  "Riverbraid-Judicial-Gold", "Riverbraid-Memory-Gold", "Riverbraid-Integration-Gold",
  "Riverbraid-Refusal-Gold", "Riverbraid-Cognition", "Riverbraid-Harness-Gold",
  "Riverbraid-Temporal-Gold", "Riverbraid-Action-Gold", "Riverbraid-Audio-Gold",
  "Riverbraid-Vision-Gold", "Riverbraid-Lite", "Riverbraid-Interface-Gold"
];

const SNAPSHOT = "constitution.snapshot.json";
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

function checkFloor(buf, label) {
  if (buf.length === 0 || buf[buf.length-1] !== 0x0a) throw new Error(`LF_VIOLATION:${label}`);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) throw new Error(`BOM_VIOLATION:${label}`);
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (b === 0x0d || b === 0x00 || b < 0x09 || (b > 0x0a && b < 0x20) || b > 0x7e)
      throw new Error(`ILLEGAL_BYTE:${label}:${i}`);
  }
}

function getSnapshot() {
  const hashes = {};
  const rootDir = path.dirname(process.cwd());
  GOVERNED.forEach(repo => {
    const dir = repo === "Riverbraid-Core" ? process.cwd() : path.join(rootDir, repo);
    if (!fs.existsSync(dir)) return;
    const files = [];
    function walk(d) {
      fs.readdirSync(d, { withFileTypes: true }).forEach(entry => {
        const full = path.join(d, entry.name);
        const rel = path.relative(rootDir, full).split(path.sep).join("/");
        if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "__pycache__") return;
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile()) {
          const buf = fs.readFileSync(full);
          checkFloor(buf, rel);
          files.push({path: rel, sha256: sha256(buf)});
        }
      });
    }
    walk(dir);
    hashes[repo] = files.sort((a,b) => a.path.localeCompare(b.path));
  });

  const payload = JSON.stringify(hashes, null, 0) + "\n";
  return {
    version: "1.5.0",
    sha256: sha256(Buffer.from(payload)),
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
  if (current.sha256 !== snap.sha256) throw new Error("CRITICAL: State Drift Detected.");
  console.log(" VERIFIED: Floor is Stationary.");
} else {
  console.log("Usage: node run-vectors.cjs [snapshot|verify]");
  process.exit(1);
}
