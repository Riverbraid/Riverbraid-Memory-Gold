export const validateMemory = (content, threshold = 0.5) => {
    const tokens = content.split(/\s+/).filter(Boolean);
    const tokenCount = tokens.length;
    const uniqueKeywords = new Set(content.toLowerCase().match(/\b(\w+)\b/g)).size;
    const cognitiveWeight = tokenCount === 0 ? 0 : uniqueKeywords / tokenCount;

    return {
        persisted: cognitiveWeight >= threshold,
        weight: cognitiveWeight,
        action: cognitiveWeight >= threshold ? 'COMMIT' : 'DISCARD'
    };
};
