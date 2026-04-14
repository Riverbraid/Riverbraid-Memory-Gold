const fs = require('fs');
const path = require('path');

function checkGate() {
  // Use a relative search to find the Core if absolute fails
  const possiblePaths = [
    '/workspaces/Riverbraid-Core/semantic-bridge.json',
    path.join(__dirname, '../Riverbraid-Core/semantic-bridge.json')
  ];
  
  const corePath = possiblePaths.find(p => fs.existsSync(p));

  if (!corePath) {
    process.exit(1); // Silent failure for the proof loop
  }

  const bridge = JSON.parse(fs.readFileSync(corePath, 'utf8'));
  if (bridge.invariants.scale_separation !== "gate_active") {
    process.exit(1);
  }
  process.exit(0);
}

checkGate();
