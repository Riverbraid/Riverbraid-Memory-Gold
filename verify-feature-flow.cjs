#!/usr/bin/env node
"use strict";
const fs = require("fs");
function fail(code) { console.error(code); process.exit(1); }
const file = "feature-flow.json";
if (!fs.existsSync(file)) fail("MISSING_FEATURE_FLOW");
const data = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
if (data.version !== "1.0.0") fail("INVALID_VERSION");
const change = data.current_change;
if (change.status === "active") {
  if (change.requires_vector_update !== true) fail("ACTIVE_MUST_UPDATE_VECTOR");
}
console.log(`FEATURE_FLOW_VERIFIED:${data.repo}:${change.id}`);