# RIVERBRAID-SPEC.md
Version 1.5.0-Sovereign
Stationary Floor Root: de2062
Sovereign Layer Root: adef13
Date of Last Canonical Seal: 2026-04-14

## 1. Core Invariants
1. **Byte-Floor Rule:** ASCII-7 only, LF-terminated, no BOM.
2. **Merkle Root Rule:** Canonical state matches `de2062`.
3. **Fail-Closed Rule:** Any deviation terminates with non-zero exit code.

## 2. Go44 Predicate
Go44 is asserted when VSCS (Verified Stationary Consensus State) is achieved, meaning the Merkle root is valid and no divergence exists between repositories and the signed manifest.

## 3. Verification
Run `node run-vectors.cjs verify` to assert the stationary state.
