import json
from pathlib import Path

INVARIANT_SIGNAL = "MEANING_CENTRIC"
DEFAULT_THRESHOLD = 0.5

def thermodynamic_signal(entry: dict) -> float:
    meaning = float(entry.get("unique_meaning", 0.0))
    tokens = float(entry.get("token_volume", 1.0))
    if tokens <= 0: return 0.0
    return min(meaning / tokens, 1.0)

def should_persist(entry: dict, threshold: float = DEFAULT_THRESHOLD) -> bool:
    return thermodynamic_signal(entry) >= threshold

def commit(entry: dict, state_path: str | None = None, threshold: float = DEFAULT_THRESHOLD) -> dict:
    score = thermodynamic_signal(entry)
    if score < threshold:
        return {"persisted": False, "signal_score": score, "reason": "Below thermodynamic threshold.", "signal": INVARIANT_SIGNAL}
    path = Path(state_path) if state_path else Path(__file__).parent / "memory.state"
    existing = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
    entry_with_meta = {**entry, "_signal_score": score}
    existing.append(entry_with_meta)
    path.write_text(json.dumps(existing, indent=2, sort_keys=True), encoding="utf-8")
    return {"persisted": True, "signal_score": score, "reason": "Committed.", "signal": INVARIANT_SIGNAL}
