export function deepCopyMatchingKeys<T extends object, S extends object>(target: T, source: S): void {
  (Object.keys(target) as (keyof T)[]).forEach((key: any) => {
    if (key in source) {
      const targetValue = target[key];
      const sourceValue = source[key as keyof S];

      if (typeof targetValue === "object" && targetValue !== null && typeof sourceValue === "object" && sourceValue !== null) {
        deepCopyMatchingKeys(targetValue as any, sourceValue as any);
      } else {
        // 타입 변환 로직
        if (typeof targetValue === "number") {
          const convertedValue = Number(sourceValue);
          (target as any)[key] = isNaN(convertedValue) ? targetValue : convertedValue;
        } else if (typeof targetValue === "string") {
          (target as any)[key] = String(sourceValue);
        } else if (typeof targetValue === "boolean") {
          (target as any)[key] = Boolean(sourceValue);
        } else {
          (target as any)[key] = sourceValue;
        }
      }
    }
  });
}
