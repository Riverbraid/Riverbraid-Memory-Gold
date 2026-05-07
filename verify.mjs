import { readFileSync, writeFileSync } from "fs";
import { verify } from "./index.js";

const protocol = JSON.parse(readFileSync("protocol.steps", "utf8"));
const input = protocol.canonical_input;
const expectedRatio = protocol.expected_result;

const result = verify(input);

const output = {
  schema: "riverbraid.gold.verify.output",
  version: "1.0.0",
  repo: "Riverbraid-Memory-Gold",
  ring: 1,
  petal: "Memory-Gold",
  invariant: "MEMORY_SIGNAL_RATIO",
  status: result.pass === true && Math.abs(result.ratio - expectedRatio) < 1e-10 ? "VERIFIED" : "FAILED",
  result: result.ratio,
  expected_result: expectedRatio,
  canonical_signal: result.signal,
  canonical_reason: result.reason
};

writeFileSync("verify-output.json", JSON.stringify(output, null, 2) + "\n", "utf8");

if (output.status !== "VERIFIED") {
  console.error("MEMORY_GOLD_VERIFICATION_FAILED");
  process.exit(1);
}
console.log("MEMORY_GOLD_VERIFICATION_SUCCESS");
