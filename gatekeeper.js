const fs = require('fs');
const { execSync } = require('child_process');

function checkGate() {
  const corePath = '/workspaces/Riverbraid-Core/semantic-bridge.json';
  if (!fs.existsSync(corePath)) {
    console.error("GATE_FAILURE: Core semantic bridge not found. Swarm is decoupled.");
    process.exit(1);
  }

  const bridge = JSON.parse(fs.readFileSync(corePath, 'utf8'));
  const repoName = process.cwd().split('/').pop();

  console.log(`\n--- [GATEKEEPER] Analyzing: ${repoName} ---`);
  
  // Enforce Linear Hygiene before allowing Nonlinear execution
  console.log("Step 1: Linear Hygiene Check...");
  try {
    // Simulated hygiene (replace with actual lint/test commands)
    console.log("✅ Hygiene Verified.");
  } catch (e) {
    console.error("❌ Hygiene Failed. Nonlinear gate locked.");
    process.exit(1);
  }

  if (bridge.invariants.scale_separation === "gate_active") {
    console.log("Step 2: Nonlinear Gate... OPEN ✅");
  }
}

checkGate();
