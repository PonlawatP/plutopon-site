import type { Locale } from "./config";
import { getUiStrings } from "@/lib/sanity/queries";

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
  const doc = await getUiStrings();
  return flattenUiStrings(doc, locale);
}
