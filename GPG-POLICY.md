# Riverbraid GPG Policy (v1.5.0)

## 1. Primary Signing Key
- **Fingerprint:** D9475D6B717D0E6C8EC84F6D8F86D9F4F2B083A4
- **Owner:** Michael John Tilk (Steward of the Riverbraid)
- **Algorithm:** Ed25519 (Enforced per SPEC Section 3)

## 2. Rotation and Validity
- **Rotation Interval:** 2 Years.
- **Next Rotation Date:** 2028-04-14
- **Validity:** Indefinite for historical verification; signatures remain valid if the state matches the stationary Merkle root de2062.

## 3. Revocation Procedure
In the event of compromise:
1. Publish the Revocation Certificate to all peer nodes and GitHub.
2. The system enters Fail-Closed Mode immediately.
3. No further state transitions are permitted until a new Sovereign Anchor is established via 2-of-2 multisig witness consensus.

## 4. Backup and Storage
- **Primary:** Hardware Security Module (HSM).
- **Secondary:** Encrypted cold-storage (air-gapped).
- **Paper:** Printable Mnemonic seed for the primary key, stored in a physical vault.
