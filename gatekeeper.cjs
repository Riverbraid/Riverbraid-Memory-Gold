const fs = require('fs');
const path = require('path');

function checkGate() {
  const possiblePaths = [
    '/workspaces/Riverbraid-Core/semantic-bridge.json',
    path.join(__dirname, '../Riverbraid-Core/semantic-bridge.json')
  ];
  
  const corePath = possiblePaths.find(p => fs.existsSync(p));

  if (!corePath) {
    console.error("❌ CORE NOT FOUND");
    process.exit(1);
  }

  const bridge = JSON.parse(fs.readFileSync(corePath, 'utf8'));
  if (bridge.invariants.scale_separation !== "gate_active") {
    console.error("❌ SEMANTIC MISMATCH");
    process.exit(1);
  }
  process.exit(0);
}

checkGate();
