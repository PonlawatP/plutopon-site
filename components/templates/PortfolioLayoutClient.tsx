"use client";
import HeaderSection from "@/components/templates/HeaderSection";
import { useSectionTransition } from "@/hooks/useSectionTransition";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useNavigationStore } from "@/lib/store";
import type { HeaderData } from "@/lib/sanity/queries";

export default function PortfolioLayoutClient({
  children,
  header,
}: {
  children: React.ReactNode;
  header: HeaderData | null;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const isNavigating = useNavigationStore((s) => s.isNavigating);
  const setIsNavigating = useNavigationStore((s) => s.setIsNavigating);

  // auto-hide header on blog pages; debug toggle overrides until next route change
  const autoShow = !/^\/(en|th)\/blog\//.test(pathname);
  const [override, setOverride] = useState<boolean | null>(null);
  const show = override ?? autoShow;
  useEffect(() => {
    setOverride(null);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // New route content mounted -> hide loader, let content fade in.
    setIsNavigating(false);
  }, [pathname, setIsNavigating]);

  // Set first load to false after the initial mount
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  // Header animates only once on mount
  useSectionTransition(headerRef);

  // Content animates on every route change.
  // On first visit, wait for header to finish (~0.6s) before starting content.
  // On route change, start content immediately.
  useSectionTransition(contentRef, [pathname], isFirstLoad ? 0.6 : 0);

  return (
    <main className="mx-auto w-full max-w-4xl text-lg">
      <div ref={headerRef}>
        <HeaderSection show={show} header={header} />
      </div>
      <div className="relative">
        {/* Loading shown in the middle of the content during the fade-out → fade-in gap */}
        <div
          aria-hidden={!isNavigating}
          className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
            isNavigating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-300" />
        </div>
        <div ref={contentRef} id="page-content">
          {children}
        </div>
      </div>
    </main>
  );
}
