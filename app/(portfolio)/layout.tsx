import HeaderSection from "@/components/templates/HeaderSection";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl text-lg">
      <HeaderSection />
      {children}
    </main>
  );
}