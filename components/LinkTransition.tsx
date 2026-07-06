"use client"; 
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useNavigationStore } from "@/lib/store";

type TransitionProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function LinkTransition({ children, href, onClick, ...props }: TransitionProps) {
    const router = useRouter();
    const setIsNavigating = useNavigationStore((s) => s.setIsNavigating);

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (typeof window !== "undefined" && window.location.pathname === href) return;

      e.preventDefault();

      // 1. Call external onClick if provided (must be before async ops for event validity)
      if (onClick) {
        onClick(e);
      }

      // 2. Show loader in the content area during the fade-out → fade-in gap
      setIsNavigating(true);

      // 3. Run fade & blur out animation on content area only
      await gsap.to("#page-content", {
        opacity: 0,
        filter: "blur(20px)",
        y: 20,
        duration: 0.4,
        ease: "power2.inOut"
      });

      // 3. Jump to top instantly (covered by blur), then move to new route
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      router.push(href as string);

      // Note: The entrance animation is handled by useSectionTransition 
      // in PortfolioLayout which triggers when the new content mounts.
    }

    return (
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
}