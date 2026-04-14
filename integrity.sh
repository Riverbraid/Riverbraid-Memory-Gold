#!/bin/sh
set -e
echo "--- Riverbraid Integrity Check ---"
if find . -type f \( -name "*.json" -o -name "*.cjs" -o -name "*.sh" \) | xargs file | grep -q "CRLF"; then
  echo "❌ ERR: DIRTY_BYTES_DETECTED"; exit 1
fi
if [ ! -f "SHA256SUMS" ]; then
  echo "⚠️  No SHA256SUMS (skipping strict verification)"; exit 0
fi
sha256sum -c SHA256SUMS --quiet || { echo "❌ ERR: HASH_MISMATCH"; exit 1; }
if [ -f "MERKLE_ROOT" ]; then
  /workspaces/verify-merkle.sh || exit 1
fi
echo "✅ PASS"
