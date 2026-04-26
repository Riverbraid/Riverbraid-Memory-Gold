#!/bin/bash

# Riverbraid-Core Verifier (Hardened)
MANIFEST="manifest.json"

case "$1" in
    init)
        echo "Initializing Riverbraid-Core..."
        touch "$MANIFEST"
        echo "Done."
        ;;
    snapshot)
        echo "Recording file states..."
        # Exclude manifest itself and hidden git files
        find . -maxdepth 1 -type f ! -name "$MANIFEST" ! -name ".*" -exec sha256sum {} + > "$MANIFEST"
        echo "Done: Snapshot recorded in $MANIFEST."
        ;;
    verify)
        echo "Verifying integrity..."
        if [ ! -f "$MANIFEST" ]; then
            echo "ERROR: No manifest found. Run snapshot first."
            exit 1
        fi
        
        # Create a stable verification state
        find . -maxdepth 1 -type f ! -name "$MANIFEST" ! -name ".*" -exec sha256sum {} + > ".verify.tmp"
        
        if diff "$MANIFEST" ".verify.tmp" > /dev/null; then
            echo "Integrity Verified."
            rm ".verify.tmp"
            exit 0
        else
            echo "FAIL: File state has changed."
            diff "$MANIFEST" ".verify.tmp"
            rm ".verify.tmp"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 {init|snapshot|verify}"
        exit 1
        ;;
esac
