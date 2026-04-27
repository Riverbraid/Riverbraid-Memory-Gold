#!/usr/bin/env node
"use strict";
const fs = require("fs");
function fail(code) { console.error(code); process.exit(1); }
const file = "feature-flow.json";
if (!fs.existsSync(file)) { fail("MISSING_FEATURE_FLOW"); }
const data = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
if (data.version !== "1.0.0") { fail("INVALID_FEATURE_FLOW_VERSION"); }
const change = data.current_change;
if (change.type === "linear" && change.requires_protocol_version_change !== false) { fail("LINEAR_CONSTRAINT_VIOLATION"); }
if (change.type === "nonlinear" && change.requires_protocol_version_change !== true) { fail("NONLINEAR_CONSTRAINT_VIOLATION"); }
console.log(`FEATURE_FLOW_VERIFIED: ${data.repo}:${change.id}`);
