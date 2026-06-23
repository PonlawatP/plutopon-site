"use client";
import HeaderSection from "@/components/templates/HeaderSection";
import { useSectionTransition } from "@/hooks/useSectionTransition";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // auto-hide header on blog pages; debug toggle overrides until next route change
  const autoShow = !pathname.startsWith("/blog/");
  const [override, setOverride] = useState<boolean | null>(null);
  const show = override ?? autoShow;
  useEffect(() => {
    setOverride(null);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

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
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={() => setOverride(!show)}
          className="fixed bottom-4 right-4 z-50 rounded bg-blue-500 px-3 py-1 text-sm text-white"
        >
          {show ? "Hide" : "Show"} header
        </button>
      )}
      <div ref={headerRef}>
        <HeaderSection show={show} />
      </div>
      <div ref={contentRef} id="page-content">
        {children}
      </div>
    </main>
  );
}