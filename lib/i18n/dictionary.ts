import type { Locale } from "./config";

export type Dictionary = Record<string, string>;

// Internal Sanity system keys to ignore while flattening.
const isSystemKey = (k: string) => k.startsWith("_");

export function flattenUiStrings(doc: unknown, locale: Locale): Dictionary {
  const out: Dictionary = {};
  if (!doc || typeof doc !== "object") return out;
  for (const [group, fields] of Object.entries(doc as Record<string, any>)) {
    if (isSystemKey(group) || !fields || typeof fields !== "object") continue;
    for (const [key, value] of Object.entries(fields as Record<string, any>)) {
      if (isSystemKey(key) || !value || typeof value !== "object") continue;
      const v = value[locale];
      if (typeof v === "string" && v.length > 0) out[`${group}.${key}`] = v;
    }
  }
  return out;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  // Lazy import: keeps the pure flattenUiStrings unit-testable without
  // pulling the Sanity client (and its env-var assertions) into the module graph.
  const { getUiStrings } = await import("@/lib/sanity/queries");
  const doc = await getUiStrings();
  return flattenUiStrings(doc, locale);
}
