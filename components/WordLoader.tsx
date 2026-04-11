
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
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ repeat: -1 });
      const widths = wordRefs.current.map((el) => el?.offsetWidth || 0);

      // Set initial width to the first word's width
      gsap.set(containerRef.current, { width: widths[0] });
      gsap.set(".char", { opacity: 0 });

      words.forEach((_, index) => {
        const currentWidth = widths[index];
        const nextIndex = (index + 1) % words.length;
        const nextWidth = widths[nextIndex];

        // 1. Animate characters in
        tl.fromTo(
          `.word-${index} .char`,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
          }
        );

        // 2. Wait 2s
        tl.to({}, { duration: 2 });

        // 3. Animate characters out AND animate width to next word
        tl.to(
          `.word-${index} .char`,
          {
            opacity: 0,
            y: -5,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.in",
          }
        );

        // Transition width to next word during the "gap"
        tl.to(containerRef.current, {
          width: nextWidth,
          duration: 0.5,
          ease: "power2.inOut",
        }, ">-0.2"); // Start slightly before characters finish moving out
      });
    },
    { scope: containerRef, dependencies: [words] }
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex h-[1em] overflow-hidden", className)}
    >
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => { wordRefs.current[index] = el; }}
          className={`word-${index} absolute left-0 top-0 flex gap-x-[0.1em] whitespace-nowrap`}
        >
          {word.split("").map((char, charIndex) => (
            char === " " ? <span key={charIndex} className="block w-[0.3em]"></span>
             : <span key={charIndex} className={cn("char inline-block leading-none", textClassName)}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default WordLoader;
