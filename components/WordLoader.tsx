
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// Split into grapheme clusters so Thai/other combining marks stay attached to their base.
// split("") breaks on UTF-16 units and detaches Thai vowels/tone marks.
const splitGraphemes = (input: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(input), (s) => s.segment);
  }
  return Array.from(input); // fallback: code points (still better than UTF-16 units)
};

// Thai script needs no inter-cluster gap; Latin uses letter-spacing.
const hasThai = (input: string): boolean => /[฀-๿]/.test(input);

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

      const widths = wordRefs.current.map((el) => el?.offsetWidth || 0);
      const tl = gsap.timeline({ repeat: -1 });

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

      // Kill this infinite timeline on cleanup so re-runs don't stack.
      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [words.join(",")] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        // Taller box + vertically-centered glyphs give Thai above/below marks room.
        "relative inline-flex items-center h-[1.4em] overflow-hidden leading-none",
        className
      )}
    >
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => { wordRefs.current[index] = el; }}
          className={`word-${index} absolute left-0 top-0 bottom-0 flex items-center ${hasThai(word) ? "" : "gap-x-[0.1em]"} whitespace-nowrap`}
        >
          {splitGraphemes(word).map((char, charIndex) => (
            char === " " ? <span key={charIndex} className="block w-[0.3em]"></span>
             // py extends the background-paint box so bg-clip-text gradients cover
             // Thai marks inking above/below the 1em box; -my cancels the layout growth.
             : <span key={charIndex} className={cn("char inline-block leading-none py-[0.25em] -my-[0.25em] opacity-0", textClassName)}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export default WordLoader;
