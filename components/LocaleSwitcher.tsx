"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();
  // Portal to <body>: the layout's animated content wrapper has a CSS transform,
  // which traps `fixed` children in its stacking context (can't beat the nav's z-index).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Replace the leading locale segment with `next`.
    const rest = pathname.replace(/^\/(en|th)(?=\/|$)/, "");
    const target = `/${next}${rest || ""}`;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    router.push(target);
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-[1002] flex gap-2 text-sm">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={l === locale ? "font-bold underline" : "opacity-60"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>,
    document.body
  );
}
