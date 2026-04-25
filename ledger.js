import fs from "fs";
import path from "path";

const LEDGER_PATH = path.join(process.cwd(), "relational_ledger.jsonl");

export function commitToMemory(event) {
  console.log("💾 Memory-Gold: Committing event to the relational ledger...");
  const entry = JSON.stringify({ ...event, recordedAt: new Date().toISOString() }) + "\n";
  fs.appendFileSync(LEDGER_PATH, entry);
  return { status: "persisted", path: LEDGER_PATH };
}
