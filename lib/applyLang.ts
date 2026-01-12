"use client";

import useIsPreferredLanguageArabic from "./getPreferredLanguage";

type LangValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LangObject
  | LangValue[];

interface LangObject {
  [key: string]: LangValue;
}

export function useApplyLang<T extends object>(data: T): T {
  const isArabic = useIsPreferredLanguageArabic();

  const isNumericKeyObject = (obj: LangObject): boolean => {
    const keys = Object.keys(obj);
    return keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
  };

  // Accept unknown to allow passing T here
  const translate = (input: unknown): LangValue => {
    // Arrays
    if (Array.isArray(input)) {
      return input.map((item) =>
        typeof item === "object" && item !== null
          ? translate(item)
          : (item as LangValue)
      );
    }

    // Objects
    if (typeof input === "object" && input !== null) {
      const obj = input as LangObject;

      // Convert numeric-key object -> array-like
      if (isNumericKeyObject(obj)) {
        return Object.keys(obj)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => translate(obj[k]));
      }

      const result: LangObject = {};

      for (const key in obj) {
        const rawValue = obj[key];

        // If there is a corresponding _ar key, handle it here
        if (key.endsWith("_ar")) {
          // skip: will be handled when processing base key
          continue;
        }

        const arabicKey = key + "_ar";
        const arabicRaw = obj[arabicKey];

        // If arabic version exists, apply language fallback rules
        if (arabicKey in obj) {
          const arValue = typeof arabicRaw === "string" ? arabicRaw : undefined;
          const hasArabic = arValue?.trim() !== "";
          result[key] = isArabic && hasArabic ? (arValue as string) : rawValue;
          continue;
        }

        // Arrays nested under this key
        if (Array.isArray(rawValue)) {
          result[key] = rawValue.map((item) =>
            typeof item === "object" && item !== null
              ? translate(item)
              : (item as LangValue)
          );
          continue;
        }

        // Nested object
        if (typeof rawValue === "object" && rawValue !== null) {
          result[key] = translate(rawValue);
          continue;
        }

        // Primitive copy
        result[key] = rawValue as LangValue;
      }

      return result;
    }

    // Primitive (string/number/boolean/null/undefined)
    return input as LangValue;
  };

  // translate accepts unknown, so cast final value back to T
  return translate(data as unknown) as unknown as T;
}
