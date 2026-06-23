# i18n / Localization System — Design

Date: 2026-06-23
Project: plutopon-site (Next.js 14 App Router)

## Goal

Add localization. Default language detected from client system. Locale is
saved (persists across visits). Locale can be forced via URL prefix
(`/en/*`, `/th/*`). Languages: English (`en`) and Thai (`th`). UI strings
managed in Sanity. URL scheme: prefix all locales. Default locale: `en`.

## Decisions

| Topic | Choice |
|-------|--------|
| Locales | `en`, `th` |
| Default locale | `en` |
| URL scheme | Prefix all: `/en/*`, `/th/*` |
| UI string source | Sanity CMS (field-level `{en, th}` objects) |
| Client delivery | React Context provider |
| Locale persistence | `NEXT_LOCALE` cookie (1 year) |

Out of scope: localizing blog **post content**. Posts stay single-language.
Flagged for later using the same `{en, th}` pattern on the `post` schema.

## Architecture

### 1. Locale config — `lib/i18n/config.ts`

Single source of truth.

```ts
export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const isLocale = (x: string): x is Locale =>
  (locales as readonly string[]).includes(x);
```

### 2. Middleware — `middleware.ts` (project root)

Runs on every request. `matcher` excludes `/studio`, `/api`, `/_next`,
and any path with a file extension.

Locale resolution order:
1. `NEXT_LOCALE` cookie (if valid locale)
2. `Accept-Language` request header (client system language) — first match
   against supported locales
3. `defaultLocale` (`en`)

Behavior:
- If the pathname already starts with a supported locale segment → pass
  through; refresh `NEXT_LOCALE` cookie to that segment.
- Else → 307 redirect to `/{resolvedLocale}{pathname}` and set
  `NEXT_LOCALE` cookie.

Cookie: `NEXT_LOCALE`, `path=/`, `maxAge=31536000`, `sameSite=lax`.

Accept-Language parsing: split on `,`, strip quality (`;q=`), take primary
subtag (`th-TH` → `th`), return first that is a supported locale.

### 3. Routing restructure

Move `app/(portfolio)/*` → `app/[lang]/*`. Affected routes:
`/`, `/blog`, `/blog/[slug]`, `/projects`, `/resume`.

- `<html>`/`<body>` ownership: Next requires a root `app/layout.tsx`
  rendering `<html><body>`, but root layout **cannot read `params.lang`**.
  To set `<html lang>` correctly per locale, the chosen approach: root
  `app/layout.tsx` renders only `<html lang="en">` + `<body>` + fonts +
  global CSS + `LayoutClient` as a **static fallback** (covers `/studio`,
  `/error` which are outside `[lang]`). The `[lang]/layout.tsx` sets the
  accurate locale on the document via the `lang` attribute is not
  re-settable from a nested layout in App Router, so the correct
  per-locale `lang` is exposed instead through metadata `alternates`
  (`hreflang`) for SEO, and the static `<html lang="en">` is the rendered
  attribute.
  - ponytail: `<html lang>` hard-coded `en` is a known ceiling. Upgrade
    path if a per-locale `lang` attribute becomes required: move
    `<html>`/`<body>` out of root into a `(shell)` layout that wraps both
    `[lang]` and the locale-free routes, OR set `lang` client-side via a
    tiny effect in `I18nProvider`. Not done now — SEO `hreflang` covers the
    real need.
- `app/[lang]/layout.tsx`:
  - Validate `params.lang` with `isLocale`, else `notFound()`.
  - `generateStaticParams()` → `locales.map(lang => ({ lang }))`.
  - Fetch dictionary via `getDictionary(lang)`.
  - Wrap children in `<I18nProvider locale={lang} dict={dict}>`.

### 4. UI strings in Sanity — `uiStrings` singleton schema

New schema `sanity/schemas/uiStrings.ts`. One singleton document. Each
translatable string is a field of a reusable `localizedString` object type:

```ts
// object type: localizedString -> { en: string, th: string }
```

Fields grouped by area (nav, footer, common, ...). Registered in
`sanity/schemas/index.ts`. Studio structure pins it as a singleton
(single edit link, no "create new").

Fetch + flatten — `lib/i18n/getDictionary.ts`:
- GROQ query selects the `uiStrings` doc.
- Flatten each `{en, th}` to the requested locale → `Record<string,string>`.
- Uses `next-sanity` client; relies on Next fetch caching (revalidate as
  per existing Sanity client config).

`Dictionary` type = `Record<string, string>` (flat key → translated value).

### 5. I18n Context + hook — `lib/i18n/I18nProvider.tsx`

- Client component. Props: `locale`, `dict`.
- Exposes `useI18n()` → `{ locale, t }` where `t(key)` returns
  `dict[key] ?? key` (missing key falls back to the key string).
- Server components can read `params.lang` + call `getDictionary` directly
  without the provider; provider exists for client components.

### 6. Locale switcher — `components/LocaleSwitcher.tsx`

Client component:
- Reads current pathname (`usePathname`), strips the leading locale segment,
  builds `/{newLocale}{rest}`.
- Sets `NEXT_LOCALE` cookie, `router.push(newPath)`.
- Renders en/th toggle.

## Data flow

```
request → middleware (resolve + redirect/cookie)
        → app/[lang]/layout (validate, getDictionary, I18nProvider)
        → page (server: params.lang + dict;  client: useI18n)
LocaleSwitcher → set cookie + router.push(/newLocale/...)
```

## Error handling

- Unknown `lang` segment → `notFound()` (renders existing `not-found.tsx`).
- Missing dictionary key → `t()` returns the key (visible, non-breaking).
- Sanity `uiStrings` doc missing/empty → `getDictionary` returns `{}`; all
  `t()` calls fall back to keys. Site still renders.

## Testing

- Unit: `Accept-Language` parser (e.g. `th-TH,en;q=0.9` → `th`;
  `fr` → `en` fallback). One `assert`-based check.
- Unit: `getDictionary` flatten (`{en,th}` → locale value; missing → `{}`).
- Manual: visit `/` with no cookie + `Accept-Language: th` → redirects
  `/th`. Switch via toggle → URL + cookie update, persists on reload.
  Visit `/studio` → unaffected.

## Migration notes

- Existing internal links/`<Link href>` must gain locale prefix (or use a
  locale-aware link helper). Audit links in `components/` during impl.
- `app/(portfolio)/layout.tsx` content merges into `app/[lang]/layout.tsx`.
- Metadata `alternates` updated with `hreflang` entries for en/th.
