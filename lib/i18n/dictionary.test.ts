import { test, expect } from "bun:test";
import { flattenUiStrings } from "./dictionary";

const doc = {
  nav: { home: { en: "Home", th: "หน้าแรก" } },
  footer: { copyright: { en: "© 2026", th: "© 2026" } },
};

test("flatten picks locale value with dotted keys", () => {
  expect(flattenUiStrings(doc, "th")).toEqual({
    "nav.home": "หน้าแรก",
    "footer.copyright": "© 2026",
  });
});

test("flatten skips empty/missing locale values", () => {
  const partial = { nav: { home: { en: "Home" } } };
  expect(flattenUiStrings(partial, "th")).toEqual({});
});

test("flatten of null/empty returns empty object", () => {
  expect(flattenUiStrings(null, "en")).toEqual({});
});
