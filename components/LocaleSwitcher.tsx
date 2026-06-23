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
