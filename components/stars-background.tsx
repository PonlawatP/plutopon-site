"use client";
import { cn } from "@/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  parallaxSpeed?: number;
  mouseMoveParallaxSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  parallaxSpeed = 0.1,
  mouseMoveParallaxSpeed = 0.05,
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const scrollYRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
    ]
  );

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width } = canvas.getBoundingClientRect();
        const height = document.documentElement.scrollHeight || window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setStars(generateStars(width, height));
      }
    };

    updateStars();
    
    // Initialize mouse position to center
    if (typeof window !== "undefined") {
      mousePositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const resizeObserver = new ResizeObserver(updateStars);
    resizeObserver.observe(document.body);

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const viewportHeight = canvas.height;
      const viewportWidth = canvas.width;
      const scrollOffset = scrollYRef.current * parallaxSpeed;

      const mouseOffsetX =
        (mousePositionRef.current.x - viewportWidth / 2) *
        mouseMoveParallaxSpeed;
      const mouseOffsetY =
        (mousePositionRef.current.y - viewportHeight / 2) *
        mouseMoveParallaxSpeed;

      stars.forEach((star) => {
        // Draw star relative to viewport, applying both parallax offsets
        const drawX = star.x - mouseOffsetX;
        const drawY = star.y - scrollOffset - mouseOffsetY;

        // Only draw if within viewport range
        if (
          drawY >= -10 &&
          drawY <= viewportHeight + 10 &&
          drawX >= -10 &&
          drawX <= viewportWidth + 10
        ) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        }

        if (star.twinkleSpeed !== null) {
          star.opacity =
            0.5 +
            Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars, parallaxSpeed, mouseMoveParallaxSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full absolute inset-0", className)}
    />
  );
};
