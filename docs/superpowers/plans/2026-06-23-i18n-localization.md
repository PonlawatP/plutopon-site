# i18n / Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add en/th localization with client-language detection, persisted locale, and URL-prefixed routing (`/en/*`, `/th/*`), UI strings sourced from Sanity.

**Architecture:** Next.js middleware resolves locale (cookie → Accept-Language → default `en`) and redirects unprefixed paths. Portfolio routes move under `app/[lang]/`. A Sanity `uiStrings` singleton holds field-level `{en,th}` strings, flattened per-locale by `getDictionary` and delivered to client components via an `I18nProvider` Context.

**Tech Stack:** Next.js 14 App Router, next-sanity, React Context, `bun test` (built-in, no new dep).

## Global Constraints

- Locales: `en`, `th`. Default: `en`. Copied verbatim from spec.
- URL scheme: prefix ALL locales (`/en/*`, `/th/*`).
- Cookie: `NEXT_LOCALE`, `path=/`, `maxAge=31536000`, `sameSite=lax`.
- Middleware must NOT touch `/studio`, `/api`, `/_next`, files with extensions.
- No new npm dependency. Tests run via `bun test`.
- Blog post CONTENT localization is out of scope.

---

### Task 1: Locale config + Accept-Language parser

**Files:**
- Create: `lib/i18n/config.ts`
- Test: `lib/i18n/config.test.ts`

**Interfaces:**
- Produces: `locales` (`readonly ['en','th']`), `type Locale`, `defaultLocale: Locale`, `isLocale(x: string): x is Locale`, `resolveAcceptLanguage(header: string | null): Locale`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/i18n/config.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/i18n/config.test.ts`
Expected: FAIL — cannot find module `./config`.

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/i18n/config.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/i18n/config.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/i18n/config.ts lib/i18n/config.test.ts
git commit -m "feat(i18n): add locale config and Accept-Language parser"
```

---

### Task 2: Sanity `uiStrings` singleton schema

**Files:**
- Create: `sanity/schemas/uiStrings.ts`
- Create: `sanity/schemas/localizedString.ts`
- Modify: `sanity/schemas/index.ts`

**Interfaces:**
- Produces: Sanity types `localizedString` (object `{ en: string, th: string }`) and `uiStrings` (document, `_id == "uiStrings"`), with string fields grouped under `nav`, `footer`, `common`. Field keys produce dictionary keys of form `nav.home`, `footer.copyright`, `common.readMore` (see getDictionary flatten in Task 3).

- [ ] **Step 1: Create the localizedString object type**

```ts
// sanity/schemas/localizedString.ts
import { defineType, defineField } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "th", title: "Thai", type: "string" }),
  ],
});
```

- [ ] **Step 2: Create the uiStrings singleton document type**

```ts
// sanity/schemas/uiStrings.ts
import { defineType, defineField } from "sanity";

const ls = (name: string, title: string) =>
  defineField({ name, title, type: "localizedString" });

export const uiStrings = defineType({
  name: "uiStrings",
  title: "UI Strings",
  type: "document",
  groups: [
    { name: "nav", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "common", title: "Common" },
  ],
  fields: [
    defineField({
      name: "nav",
      title: "Navigation",
      type: "object",
      group: "nav",
      fields: [
        ls("home", "Home"),
        ls("projects", "Projects"),
        ls("blog", "Blog"),
        ls("resume", "Resume"),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [ls("copyright", "Copyright")],
    }),
    defineField({
      name: "common",
      title: "Common",
      type: "object",
      group: "common",
      fields: [ls("readMore", "Read More"), ls("backHome", "Back Home")],
    }),
  ],
});
```

- [ ] **Step 3: Register schemas**

```ts
// sanity/schemas/index.ts
import { type SchemaTypeDefinition } from "sanity";

import { post } from "./post";
import { uiStrings } from "./uiStrings";
import { localizedString } from "./localizedString";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, uiStrings, localizedString],
};
```

- [ ] **Step 4: Verify build compiles**

Run: `bun run lint`
Expected: no TypeScript/lint errors in the new schema files.

- [ ] **Step 5: Commit**

```bash
git add sanity/schemas/uiStrings.ts sanity/schemas/localizedString.ts sanity/schemas/index.ts
git commit -m "feat(i18n): add uiStrings singleton schema"
```

---

### Task 3: getDictionary — fetch + flatten Sanity strings

**Files:**
- Create: `lib/i18n/dictionary.ts`
- Modify: `lib/sanity/queries.ts` (add `uiStrings` query + fetch)
- Test: `lib/i18n/dictionary.test.ts`

**Interfaces:**
- Consumes: `Locale` from `lib/i18n/config.ts` (Task 1).
- Produces:
  - `type Dictionary = Record<string, string>`
  - `flattenUiStrings(doc: unknown, locale: Locale): Dictionary` — pure; flattens nested `{group: {key: {en,th}}}` to `{"group.key": value}`.
  - `getDictionary(locale: Locale): Promise<Dictionary>` — fetches the `uiStrings` doc via Sanity and flattens it. Returns `{}` if missing.

- [ ] **Step 1: Write the failing test (pure flatten only)**

```ts
// lib/i18n/dictionary.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/i18n/dictionary.test.ts`
Expected: FAIL — cannot find module `./dictionary`.

- [ ] **Step 3: Add the Sanity query + fetch**

```ts
// append to lib/sanity/queries.ts
const uiStringsQuery = groq`*[_type == "uiStrings"][0]`;

export function getUiStrings() {
  return client.fetch<Record<string, any> | null>(uiStringsQuery);
}
```

- [ ] **Step 4: Write dictionary implementation**

```ts
// lib/i18n/dictionary.ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test lib/i18n/dictionary.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/i18n/dictionary.ts lib/i18n/dictionary.test.ts lib/sanity/queries.ts
git commit -m "feat(i18n): add getDictionary fetch and flatten"
```

---

### Task 4: I18nProvider Context + useI18n hook

**Files:**
- Create: `lib/i18n/I18nProvider.tsx`

**Interfaces:**
- Consumes: `Locale` (Task 1), `Dictionary` (Task 3).
- Produces:
  - `<I18nProvider locale={Locale} dict={Dictionary}>` client component.
  - `useI18n(): { locale: Locale; t: (key: string) => string }` — `t` returns `dict[key] ?? key`.

- [ ] **Step 1: Write the provider + hook**

```tsx
// lib/i18n/I18nProvider.tsx
"use client";
import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionary";

type I18nValue = { locale: Locale; t: (key: string) => string };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, t: (key) => dict[key] ?? key }),
    [locale, dict]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run lint`
Expected: no errors in `I18nProvider.tsx`.

- [ ] **Step 3: Commit**

```bash
git add lib/i18n/I18nProvider.tsx
git commit -m "feat(i18n): add I18nProvider context and useI18n hook"
```

---

### Task 5: Middleware — locale resolution + redirect + cookie

**Files:**
- Create: `middleware.ts` (project root)

**Interfaces:**
- Consumes: `locales`, `defaultLocale`, `isLocale`, `resolveAcceptLanguage` (Task 1).
- Produces: Next middleware. No exports consumed by other tasks.

- [ ] **Step 1: Write the middleware**

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { locales, isLocale, resolveAcceptLanguage } from "@/lib/i18n/config";

const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Resolve preferred locale: cookie -> Accept-Language -> default.
  const cookieLocale = req.cookies.get(COOKIE)?.value;
  const preferred =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : resolveAcceptLanguage(req.headers.get("accept-language"));

  const segments = pathname.split("/");
  const first = segments[1];

  // Already prefixed: pass through, refresh cookie to that locale.
  if (isLocale(first)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, first, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return res;
  }

  // Unprefixed: redirect to /{preferred}{pathname}
  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.cookies.set(COOKIE, preferred, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return res;
}

// Exclude /studio, /api, _next, and any file with an extension.
export const config = {
  matcher: ["/((?!studio|api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 2: Manual smoke test**

Run: `bun run dev`, then:
- Visit `http://localhost:3000/` with browser sending `Accept-Language: th` → URL becomes `/th`. (Use a th-first browser, or `curl -I -H "Accept-Language: th" localhost:3000/` → `location: /th`.)
- `curl -I localhost:3000/studio` → 200, no redirect.
- `curl -I localhost:3000/projects` → `location: /en/projects` (default).

Expected: redirects as described; `/studio` untouched.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(i18n): add locale-resolving middleware"
```

---

### Task 6: Move routes under `app/[lang]/` and wire layout

**Files:**
- Move: `app/(portfolio)/page.tsx` → `app/[lang]/page.tsx`
- Move: `app/(portfolio)/blog/page.tsx` → `app/[lang]/blog/page.tsx`
- Move: `app/(portfolio)/blog/[slug]/page.tsx` → `app/[lang]/blog/[slug]/page.tsx`
- Move: `app/(portfolio)/projects/page.tsx` → `app/[lang]/projects/page.tsx`
- Move: `app/(portfolio)/resume/page.tsx` → `app/[lang]/resume/page.tsx`
- Create: `app/[lang]/layout.tsx` (replaces `app/(portfolio)/layout.tsx`)
- Delete: `app/(portfolio)/layout.tsx` (logic folded into `[lang]/layout.tsx`)

**Interfaces:**
- Consumes: `isLocale`, `locales`, `Locale` (Task 1); `getDictionary` (Task 3); `I18nProvider` (Task 4).
- Produces: `[lang]` route segment params `{ lang: Locale }` consumed by pages in Task 7.

- [ ] **Step 1: Move route files**

```bash
git mv "app/(portfolio)/page.tsx" "app/[lang]/page.tsx"
git mv "app/(portfolio)/blog" "app/[lang]/blog"
git mv "app/(portfolio)/projects" "app/[lang]/projects"
git mv "app/(portfolio)/resume" "app/[lang]/resume"
```
(`git mv` of `blog` moves `blog/page.tsx` and `blog/[slug]/page.tsx` together.)

- [ ] **Step 2: Create the new `[lang]/layout.tsx`**

This is a SERVER component that validates the locale, fetches the
dictionary, and provides it. The existing animation logic from
`(portfolio)/layout.tsx` is client-side, so it moves into a small client
wrapper kept as-is — extract it to `components/templates/PortfolioShell.tsx`
(copy the ENTIRE body of the old `(portfolio)/layout.tsx` verbatim, renaming
the component to `PortfolioShell`), then the server layout renders it.

```tsx
// app/[lang]/layout.tsx
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import PortfolioShell from "@/components/templates/PortfolioShell";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = await getDictionary(locale);
  return (
    <I18nProvider locale={locale} dict={dict}>
      <PortfolioShell>{children}</PortfolioShell>
    </I18nProvider>
  );
}
```

- [ ] **Step 3: Create `PortfolioShell.tsx` from old layout**

Copy the FULL contents of the old `app/(portfolio)/layout.tsx` into
`components/templates/PortfolioShell.tsx`. Rename the function
`PortfolioLayout` → `PortfolioShell`. Update the blog auto-hide check to be
locale-prefix-aware:

```tsx
// in PortfolioShell.tsx — replace the autoShow line:
// const autoShow = !pathname.startsWith("/blog/");
const autoShow = !/^\/(en|th)\/blog\//.test(pathname);
```
Keep everything else (refs, useSectionTransition, dev button, JSX) identical.

- [ ] **Step 4: Delete the old layout**

```bash
git rm "app/(portfolio)/layout.tsx"
```
If `app/(portfolio)/` is now empty, remove the directory.

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: build succeeds; routes listed as `/[lang]`, `/[lang]/blog`,
`/[lang]/blog/[slug]`, `/[lang]/projects`, `/[lang]/resume`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(i18n): move portfolio routes under [lang] segment"
```

---

### Task 7: Update pages for `params.lang` + generateStaticParams

**Files:**
- Modify: `app/[lang]/blog/[slug]/page.tsx` (its `generateStaticParams` must include `lang`)
- Modify: any page using `useI18n` for chrome strings (optional first pass: none required for build).

**Interfaces:**
- Consumes: `locales` (Task 1); existing `getPostSlugs` from `lib/sanity/queries.ts`.

- [ ] **Step 1: Inspect existing `generateStaticParams` in blog slug page**

Run: `grep -n "generateStaticParams" "app/[lang]/blog/[slug]/page.tsx"`
Expected: shows the existing function returning `{ slug }[]`.

- [ ] **Step 2: Update it to cross-product locales × slugs**

Replace the existing `generateStaticParams` with:

```tsx
import { locales } from "@/lib/i18n/config";
// ... existing imports (getPostSlugs etc.)

export async function generateStaticParams() {
  const slugs = await getPostSlugs(); // [{ slug }]
  return locales.flatMap((lang) =>
    slugs.map(({ slug }) => ({ lang, slug }))
  );
}
```

(If the page reads `params`, its type becomes `{ lang: string; slug: string }`.)

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: blog detail pages prerendered for both `en` and `th`.

- [ ] **Step 4: Commit**

```bash
git add "app/[lang]/blog/[slug]/page.tsx"
git commit -m "feat(i18n): include locale in blog static params"
```

---

### Task 8: LocaleSwitcher component

**Files:**
- Create: `components/LocaleSwitcher.tsx`
- Modify: `components/templates/HeaderSection.tsx` (mount the switcher — locate insertion point during impl)

**Interfaces:**
- Consumes: `locales`, `type Locale`, `useI18n` (Tasks 1, 4).
- Produces: `<LocaleSwitcher />` (no props).

- [ ] **Step 1: Write the switcher**

```tsx
// components/LocaleSwitcher.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Replace the leading locale segment with `next`.
    const rest = pathname.replace(/^\/(en|th)(?=\/|$)/, "");
    const target = `/${next}${rest || ""}`;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    router.push(target);
  }

  return (
    <div className="flex gap-2 text-sm">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={l === locale ? "font-bold underline" : "opacity-60"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the header**

Run: `grep -n "return (" components/templates/HeaderSection.tsx` to find the JSX root, then import and render `<LocaleSwitcher />` in a sensible header slot (top-right nav area). Add at top:
```tsx
import LocaleSwitcher from "@/components/LocaleSwitcher";
```

- [ ] **Step 3: Manual test**

Run: `bun run dev`. On `/en`, click `TH` → URL becomes `/th`, content language switches, reload keeps `/th` (cookie). Click `EN` on `/th/blog/foo` → `/en/blog/foo`.

Expected: prefix swap preserves the sub-path; cookie persists choice.

- [ ] **Step 4: Commit**

```bash
git add components/LocaleSwitcher.tsx components/templates/HeaderSection.tsx
git commit -m "feat(i18n): add locale switcher"
```

---

### Task 9: Locale-aware internal links + metadata hreflang

**Files:**
- Modify: internal `<Link href>` usages that hardcode unprefixed paths (audit via grep)
- Modify: `app/layout.tsx` (add `alternates.languages` hreflang)

**Interfaces:**
- Consumes: `useI18n().locale` for client links; `params.lang` for server links.

- [ ] **Step 1: Audit hardcoded internal links**

Run: `grep -rn 'href="/' components app | grep -v http`
Expected: a list of internal links (e.g. `/blog`, `/projects`). Each must
become locale-prefixed. For client components, prefix with the current
locale from `useI18n()`:
```tsx
const { locale } = useI18n();
// href={`/${locale}/blog`}
```
Update each hit found. (Middleware will still redirect bare links, but
prefixing avoids an extra 307 hop.)

- [ ] **Step 2: Add hreflang to root metadata**

In `app/layout.tsx` `metadata` object, extend `alternates`:
```tsx
alternates: {
  canonical: "https://plutopon.me",
  languages: {
    en: "https://plutopon.me/en",
    th: "https://plutopon.me/th",
  },
},
```

- [ ] **Step 3: Verify build + manual nav**

Run: `bun run build` then `bun run dev`. Click through nav on `/th` →
links stay under `/th`. View page source → `<link rel="alternate" hreflang>` present.

Expected: no cross-locale link leaks; hreflang tags emitted.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(i18n): locale-aware links and hreflang metadata"
```

---

### Task 10: Seed the `uiStrings` document in Sanity

**Files:** none (content op in Studio).

- [ ] **Step 1: Open Studio**

Run: `bun run dev`, open `http://localhost:3000/studio`. Find "UI Strings".

- [ ] **Step 2: Create the singleton + fill en/th**

Create one `uiStrings` document. Fill `nav` (home/projects/blog/resume),
`footer.copyright`, `common.readMore`, `common.backHome` for both en and th.

- [ ] **Step 3: Verify on site**

Reload `/en` and `/th`. `t("nav.home")` usages render the correct language;
missing keys fall back to the key string (visible, non-breaking).

Expected: strings render per locale.

- [ ] **Step 4: (optional) Pin singleton in Studio structure**

If a custom desk structure exists, pin `uiStrings` as a single edit link
(no "create new"). Skip if using default structure — one doc is fine.

---

## Self-Review

- **Spec coverage:** config (T1), middleware/detection/cookie (T1,T5),
  routing prefix (T6,T7), Sanity strings (T2,T3,T10), Context delivery
  (T4), switcher (T8), links+hreflang (T9). `<html lang>` static-`en`
  compromise from spec is intentionally NOT changed — documented ceiling.
- **Placeholder scan:** all code steps contain full code; no TBD/TODO.
- **Type consistency:** `Locale`, `Dictionary`, `isLocale`,
  `resolveAcceptLanguage`, `getDictionary`, `flattenUiStrings`, `useI18n`,
  `I18nProvider` names consistent across tasks.
