"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";

export const useSectionTransition = (scope: RefObject<Element>, deps: any[] = [], delay: number = 0) => {
  useGSAP(
    () => {
      const tl = gsap.timeline({
        delay,
        defaults: {
          ease: "power3.out",
          duration: 1.2,
        },
      });

      // Reset scope container initial state for entrance
      gsap.set(scope.current, { opacity: 1, filter: "blur(0px)", y: 0 });

      tl.from(".animate-split-down", {
        y: -40,
        opacity: 0,
        filter: "blur(15px)",
        stagger: 0.08,
        clearProps: "all",
      });
    },
    { scope, dependencies: deps }
  );
};
