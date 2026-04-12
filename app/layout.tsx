import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import 'lenis/dist/lenis.css'
import { cn } from "@/lib/utils";
import LayoutClient from "@/components/templates/LayoutClient";

const urbanist = Urbanist({ subsets: ["latin"],variable:'--font-sans' });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Plutopon | Full-stack Developer & UX/UI Designer",
  description: "Portfolio of Ponlawat Paraban (Plutopon), a Full-stack Developer and UX/UI Designer specializing in Next.js, React, and Tailwind CSS. I build scalable, end-to-end web applications.",
  keywords: ["Ponlawat Paraban", "Plutopon", "Full-stack Developer", "UX/UI Designer", "Next.js", "React", "TypeScript", "Tailwind CSS", "Web Development", "Portfolio"],
  metadataBase: new URL("https://plutopon.me"),
  alternates: {
    canonical: "https://plutopon.me",
  },
  openGraph: {
    title: "Plutopon | Full-stack Developer & UX/UI Designer",
    description: "Portfolio of Ponlawat Paraban (Plutopon), a Full-stack Developer and UX/UI Designer specializing in Next.js, React, and Tailwind CSS.",
    url: "https://plutopon.me",
    siteName: "Plutopon Portfolio",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Plutopon Portfolio Thumbnail",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plutopon | Full-stack Developer & UX/UI Designer",
    description: "Portfolio of Ponlawat Paraban (Plutopon), a Full-stack Developer and UX/UI Designer specializing in Next.js, React, and Tailwind CSS.",
    images: ["/images/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans dark")} style={{ colorScheme: 'dark' }}>
      <body className={urbanist.className + " relative min-h-[100dvh] bg-gradient-to-br from-[#190729] to-[#00112c]"}>
        {/* <TargetCursor spinDuration={4.5} hideDefaultCursor parallaxOn hoverDuration={0.2}/> */}
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
