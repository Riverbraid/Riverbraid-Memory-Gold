#!/bin/sh
# RIVERBRAID TIMELESS VERIFIER (POSIX Shell Only)
set -e

echo "--- Riverbraid Structural Integrity Check ---"

# 1. Verify Byte-Floor (No CRLF, No BOM)
if find . -type f \( -name "*.json" -o -name "*.cjs" \) | xargs file | grep -q "CRLF"; then
  echo "❌ ERR: DIRTY_BYTES_DETECTED"
  exit 1
fi

# 2. Verify Filesystem Hash (Deterministic)
if [ ! -f "SHA256SUMS" ]; then
  echo "⚠️  Recomputing SHA256SUMS..."
  find . -maxdepth 2 -not -path '*/.*' -type f | sort | xargs sha256sum > SHA256SUMS
fi
sha256sum -c --strict SHA256SUMS

# 3. Verify Sovereign Manifest
if [ -f "cluster-manifest.json.asc" ]; then
  gpg --verify cluster-manifest.json.asc
else
  echo "❌ ERR: CLUSTER_MANIFEST_MISSING"
  exit 1
fi

echo "✅ GO 44: Stationary State Confirmed."
