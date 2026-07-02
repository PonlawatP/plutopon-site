// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { isLocale, resolveAcceptLanguage } from "@/lib/i18n/config";

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

// Exclude /api, _next, and any file with an extension.
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
