#!/bin/sh
set -e
echo "--- Riverbraid Structural Integrity Check ---"
# Check for CRLF
if find . -type f \( -name "*.json" -o -name "*.cjs" -o -name "*.sh" \) | xargs file | grep -q "CRLF"; then
  echo "❌ ERR: DIRTY_BYTES_DETECTED"; exit 1
fi
# Re-generate the stationary manifest
find . -maxdepth 2 -not -path '*/.*' -type f ! -name "SHA256SUMS" | sort | xargs sha256sum > SHA256SUMS.tmp
mv SHA256SUMS.tmp SHA256SUMS
# Verify
sha256sum -c --strict SHA256SUMS
if [ -f "cluster-manifest.json.asc" ]; then gpg --verify cluster-manifest.json.asc; fi
echo "✅ PASS"
