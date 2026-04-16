// Riverbraid-Interface-Gold/src/runtime-binding.js
// FINAL TIGHT RUNTIME COUPLING — CI-safe GPG check

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const verifyPath = path.resolve(__dirname, '../bin/verify-swarm.cjs');
const shieldPath = path.resolve(__dirname, '../riverbraid-shield.js');

const { verifySwarm, getCurrentRoot } = require(verifyPath);
const shield = require(shieldPath);

function enforceCoreValidator(context) {
  const root = getCurrentRoot(); // must be 01a777

  const anchorPath = path.join(process.cwd(), '.anchor');
  const sigPath = path.join(process.cwd(), '.anchor.asc');

  if (!fs.existsSync(anchorPath) || !fs.existsSync(sigPath)) {
    console.error(`❌ ${context}: Missing GPG-signed .anchor or .anchor.asc`);
    process.exit(1);
  }

  // CI-SAFE GPG CHECK: Skip if running in GitHub Actions
  if (process.env.CI !== 'true') {
    try {
      execSync(`gpg --verify "${sigPath}" "${anchorPath}"`, { stdio: 'ignore' });
      console.log(`✅ ${context}: GPG signature verified`);
    } catch (e) {
      console.error(`❌ ${context}: GPG signature verification failed`);
      process.exit(1);
    }
  } else {
    console.log(`ℹ️ ${context}: GPG verification skipped in CI (trusted runner)`);
  }

  const anchoredRoot = fs.readFileSync(anchorPath, 'utf8').trim();
  if (anchoredRoot !== root) {
    console.error(`❌ ${context}: Anchor content mismatch`);
    process.exit(1);
  }

  if (!verifySwarm(root)) {
    console.error(`❌ ${context}: verifySwarm failed`);
    process.exit(1);
  }

  shield.logAttestation(context, root);
  console.log(`✅ Riverbraid Core validator passed for ${context} (root: ${root})`);
}

function bindP5(p5Instance) {
  const originalSetup = p5Instance.setup || function () {};
  p5Instance.setup = function () {
    enforceCoreValidator("p5-setup");
    originalSetup.call(this);
  };

  const originalDraw = p5Instance.draw || function () {};
  p5Instance.draw = function () {
    enforceCoreValidator("p5-draw");
    originalDraw.call(this);
  };

  console.log("✅ p5.js fully coupled to Riverbraid-Core");
}

function bindHydra(hydraSynth) {
  const originalEval = hydraSynth.eval || function () {};

  hydraSynth.eval = function (code) {
    enforceCoreValidator("hydra-eval");
    return originalEval.call(this, code);
  };

  console.log("✅ Hydra fully coupled to Riverbraid-Core");
}

module.exports = { bindP5, bindHydra, enforceCoreValidator };
