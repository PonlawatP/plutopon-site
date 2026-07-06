import { test, expect } from "bun:test";
import { isLocale, defaultLocale, resolveAcceptLanguage } from "./config";

test("isLocale", () => {
  expect(isLocale("en")).toBe(true);
  expect(isLocale("th")).toBe(true);
  expect(isLocale("fr")).toBe(false);
});

test("resolveAcceptLanguage picks first supported primary subtag", () => {
  expect(resolveAcceptLanguage("th-TH,en;q=0.9")).toBe("th");
  expect(resolveAcceptLanguage("en-US,en;q=0.9")).toBe("en");
});

test("resolveAcceptLanguage falls back to default", () => {
  expect(resolveAcceptLanguage("fr-FR,de;q=0.8")).toBe(defaultLocale);
  expect(resolveAcceptLanguage(null)).toBe(defaultLocale);
});
