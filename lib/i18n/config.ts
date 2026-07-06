export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

// Parse an Accept-Language header, return first supported locale or default.
export function resolveAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return defaultLocale;
}
