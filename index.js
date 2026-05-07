export const PETAL = "Memory-Gold";
export const INVARIANT = "MEMORY_SIGNAL_RATIO";

export function verify(input) {
  if (!input || !Array.isArray(input.store) || typeof input.target_prefix !== "string") {
    return {
      pass: false,
      signal: "memory:INVALID_INPUT",
      reason: "input.store must be an array and input.target_prefix must be a string"
    };
  }

  if (input.store.length === 0) {
    return {
      pass: true,
      ratio: 0,
      signal: "memory:EMPTY_STORE",
      reason: "Ratio is 0 for empty store"
    };
  }

  const signals = input.store.filter(item => 
    typeof item === "string" && item.startsWith(input.target_prefix)
  );
  
  const ratio = signals.length / input.store.length;

  return {
    pass: true,
    ratio: ratio,
    signal: "memory:RATIO_CALCULATED",
    reason: `Found ${signals.length} signals in ${input.store.length} total items`
  };
}
