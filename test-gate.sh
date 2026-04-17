#!/bin/bash
# Riverbraid Fail-Closed Threshold Gate v1.5.0
node run-vectors.cjs verify > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ THRESHOLD VERIFIED: System is Stationary."
  exit 0
else
  echo "❌ CRITICAL: DRIFT DETECTED. Execution Halted."
  exit 1
fi
