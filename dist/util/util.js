export function deepCopyMatchingKeys(target, source) {
    Object.keys(target).forEach((key) => {
        if (key in source) {
            const targetValue = target[key];
            const sourceValue = source[key];
            if (typeof targetValue === "object" && targetValue !== null && typeof sourceValue === "object" && sourceValue !== null) {
                deepCopyMatchingKeys(targetValue, sourceValue);
            }
            else {
                // 타입 변환 로직
                if (typeof targetValue === "number") {
                    const convertedValue = Number(sourceValue);
                    target[key] = isNaN(convertedValue) ? targetValue : convertedValue;
                }
                else if (typeof targetValue === "string") {
                    target[key] = String(sourceValue);
                }
                else if (typeof targetValue === "boolean") {
                    target[key] = Boolean(sourceValue);
                }
                else {
                    target[key] = sourceValue;
                }
            }
        }
    });
}
