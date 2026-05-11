import { readFileSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";

const PETAL = "Memory-Gold";
const INVARIANT = "MEMORY_SIGNAL_RATIO";
const RING = 1;
const REQUIRED = ["verify.mjs", "index.js", "protocol.steps", "package.json", "AUTHORITY.md", "RING.md"];

const FORBIDDEN = [
  { re: /new\s+Date\s*\(/, label: "new Date()" },
  { re: /Date\.now\s*\(/, label: "Date.now()" },
  { re: /Math\.random\s*\(/, label: "Math.random()" },
  { re: /crypto\.randomUUID\s*\(/, label: "crypto.randomUUID()" },
  { re: /performance\.now\s*\(/, label: "performance.now()" }
];

function failClosed(reason, extra = {}) {
  const out = { status: "FAILED", ring: RING, petal: PETAL, invariant: INVARIANT, repo: "Riverbraid-Memory-Gold", reason, ...extra };
  writeFileSync("verify-output.json", JSON.stringify(out, null, 2) + "\n", "utf8");
  console.error(`[${PETAL}] FAILED: ${reason}`);
  process.exit(1);
}

if (REQUIRED.some(f => !existsSync(f))) failClosed("Missing required files");

let steps;
try {
  steps = JSON.parse(readFileSync("protocol.steps", "utf8"));
} catch (e) { failClosed("Invalid protocol.steps JSON"); }

if (steps.invariant !== INVARIANT) failClosed("Invariant mismatch", { expected: INVARIANT, got: steps.invariant });
if (steps.petal !== PETAL) failClosed("Petal mismatch", { expected: PETAL, got: steps.petal });
if (steps.ring !== RING) failClosed("Ring mismatch", { expected: RING, got: steps.ring });
if (!Array.isArray(steps.steps) || steps.steps.length === 0) failClosed("Steps array invalid");
if (!Array.isArray(steps.test_vectors) || steps.test_vectors.length < 3) failClosed("Test vectors insufficient");

const src = readFileSync("index.js", "utf8");
FORBIDDEN.forEach(f => { if (f.re.test(src)) failClosed(`Forbidden pattern: ${f.label}`); });

import { verify, getBufferDepth } from "./index.js";
if (typeof verify !== "function") failClosed("index.js missing verify()");
if (typeof getBufferDepth !== "function") failClosed("index.js missing getBufferDepth()");

const vectorResults = steps.test_vectors.map(v => {
  const res = verify(v.input);
  if (res.pass !== v.expect.pass) failClosed(`Vector ${v.name} mismatch`, { expected: v.expect.pass, got: res.pass });
  return { name: v.name, pass: res.pass, signal: res.signal };
});

const output = { 
  status: "VERIFIED", 
  ring: RING, 
  petal: PETAL, 
  invariant: INVARIANT, 
  repo: "Riverbraid-Memory-Gold", 
  vector_results: vectorResults, 
  buffer_depth: getBufferDepth(),
  note: "Pilot signal logic verified. Metadata-stub behavior rejected."
};
writeFileSync("verify-output.json", JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`[${PETAL}] VERIFIED`);
