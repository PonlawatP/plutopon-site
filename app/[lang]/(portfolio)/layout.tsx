import PortfolioLayoutClient from "@/components/templates/PortfolioLayoutClient";
import { getHeader } from "@/lib/sanity/queries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export default async function PortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const header = await getHeader(locale);

  return <PortfolioLayoutClient header={header}>{children}</PortfolioLayoutClient>;
}
