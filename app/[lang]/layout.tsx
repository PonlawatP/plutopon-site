import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";

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
      <LocaleSwitcher />
      {children}
    </I18nProvider>
  );
}
