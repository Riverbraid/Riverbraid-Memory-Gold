import { readFileSync, writeFileSync } from "fs";
import { verify } from "./index.js";
const protocol = JSON.parse(readFileSync("protocol.steps", "utf8"));
const input = protocol.canonical_input;
const expectedResult = protocol.expected_result;
const result = verify(input);
const output = {
  schema: "riverbraid.gold.verify.output",
  version: "1.0.0",
  repo: "Riverbraid-Memory-Gold",
  ring: 1,
  petal: "Memory-Gold",
  invariant: "MEMORY_STATIONARY",
  status: result.pass === true && result.stationary === expectedResult ? "VERIFIED" : "FAILED",
  result: result.stationary,
  expected_result: expectedResult,
  canonical_signal: result.signal,
  canonical_reason: result.reason
};
writeFileSync("verify-output.json", JSON.stringify(output, null, 2) + "\n", "utf8");
if (output.status !== "VERIFIED") {
  console.error("MEMORY_GOLD_VERIFICATION_FAILED");
  process.exit(1);
}
console.log("MEMORY_GOLD_VERIFICATION_SUCCESS");
