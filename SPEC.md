# Riverbraid Formal Spec V1.3
## Architectural Invariants
- **The Coupling Test:** Internal complexity (tokens/logic) must not exceed external structure (Linear).
- **Scale Separation Gate:** Logic is strictly isolated from environmental entropy (no Date.now, no Math.random).
- **Stationary State:** System identity is invariant across temporal and spatial shifts; anchored in Go 44.
- **Classification:** Linear / Stationary / Fail-Closed
