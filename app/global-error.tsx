"use client"

import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import ErrorView from "@/components/ErrorView";

const urbanist = Urbanist({ subsets: ["latin"], variable: '--font-sans' });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const message = error.message || "A critical error occurred"

  return (
    <html lang="en" className={cn("font-sans dark")} style={{ colorScheme: 'dark' }}>
      <body className={urbanist.className + " relative min-h-[100dvh] bg-gradient-to-br from-[#190729] to-[#00112c]"}>
        <ErrorView 
          statusCode="500" 
          title="Critical Error" 
          message={message}
          reset={reset} 
        />
      </body>
    </html>
  )
}
