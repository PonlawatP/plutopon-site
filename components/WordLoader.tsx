
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface WordLoaderProps {
words?: string[];
className?: string;
textClassName?: string;
}

const WordLoader: React.FC<WordLoaderProps> = ({
words = [
  "branding",
  "design",
  "development",
  "ecommerce",
  "mobile apps",
  "packaging",
],
className,
textClassName,
}) => {
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(
  () => {
    const tl = gsap.timeline({ repeat: -1 });

    // Hide all characters initially
    gsap.set(".char", { opacity: 0 });

    // Animate each word with blur in/out effect
    words.forEach((_, index) => {
      // 1. Animate characters in
      tl.fromTo(
        `.word-${index} .char`,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
        }
      );

      // 2. Wait 2s after all characters are shown (full word is visible)
      // Then animate characters out
      tl.to(
        `.word-${index} .char`,
        {
          opacity: 0,
          y: -5,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.in",
        },
        "+=2" // Start 2s after previous animation ends
      );

      // 3. Wait 0.5s after characters disappear before next word starts
      tl.to({}, { duration: 0.2 });
    });
  },
  { scope: containerRef, dependencies: [words] }
);

return (
  <div
    ref={containerRef}
    className={cn("relative flex-col gap-y-6 w-full text-xl font-bold tracking-wider", className)}
  >
      {words.map((word, index) => (
        <span
          key={index}
          className={`word-${index} absolute flex gap-x-1`}
        >
          {word.split("").map((char, charIndex) => (
            char === " " ? <span key={charIndex} className="block w-3 h-2"></span>
             : <span key={charIndex} className={cn("char", textClassName)}>
              {char}
            </span>
          ))}
        </span>
      ))}
  </div>
);
};

export default WordLoader;
