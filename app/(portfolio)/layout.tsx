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
        <HeaderSection />
      </div>
      <div ref={contentRef} id="page-content">
        {children}
      </div>
    </main>
  );
}