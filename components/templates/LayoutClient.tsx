"use client"
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { contactUrls, menuItems, whitelist_footer } from "@/lib/globalvariant";
import Image from "next/image";
import Link from "next/link";
import { useDebugStore } from "@/lib/store";
import FooterSection from "./FooterSection";
import Lenis from 'lenis'
import LinkTransition from "../LinkTransition";
import { Bug, BugOff } from "lucide-react";
import router from "next/router";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Dynamic imports for heavy components
const StaggeredMenu = dynamic(() => import("@/components/StaggeredMenu"), { ssr: false });
const ShootingStars = dynamic(() => import("../shooting-stars").then(mod => mod.ShootingStars), { ssr: false });
const StarsBackground = dynamic(() => import("../stars-background").then(mod => mod.StarsBackground), { ssr: false });
const ClickSpark = dynamic(() => import("@/components/ClickSpark"), { ssr: false });
const GradualBlur = dynamic(() => import("@/components/GradualBlur"), { ssr: false });


export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDebugSession, setIsDebugSession } = useDebugStore();
  const menuRef = useRef<any>(null);
  const webringSpin = useRef<gsap.core.Tween | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMenuOpenned, setIsMenuOpenned] = useState(false);

  const startWebringSpin = () => {
    webringSpin.current = gsap.to(".webring-spin", {
      rotation: "+=360", duration: 12, ease: "none", repeat: -1, overwrite: true,
    });
    return webringSpin.current;
  };

  useEffect(() => {
    // element lives inside dynamic(ssr:false) StaggeredMenu — wait until it mounts
    let raf = 0;
    const tryStart = () => {
      if (document.querySelector(".webring-spin")) startWebringSpin();
      else raf = requestAnimationFrame(tryStart);
    };
    tryStart();
    return () => { cancelAnimationFrame(raf); webringSpin.current?.kill(); };
  }, []);

  const handleWebringEnter = () => {
    webringSpin.current?.kill();
    const el = document.querySelector(".webring-spin");
    const current = (gsap.getProperty(el, "rotation") as number) || 0;
    const target = Math.ceil(current / 360) * 360; // forward to next start point
    const remaining = target - current;
    gsap.to(".webring-spin", {
      rotation: target,
      duration: (remaining / 360) * 1.5,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        gsap.set(".webring-spin", { rotation: 0 });
      },
    });
  };
  const handleWebringLeave = () => {
    // throttle-release: resume infinite spin, ramp speed up from 0 → 1
    startWebringSpin().timeScale(0);
    const ramp = { ts: 0 };
    gsap.to(ramp, {
      ts: 1, duration: 1.5, ease: "power1.out",
      onUpdate: () => {
        webringSpin.current?.timeScale(ramp.ts);
      },
    });
  };
  const pathname = usePathname();

  // Use a local ref for the staggered menu since we can't pass a ref to a dynamic component easily
  // and the StaggeredMenu is already using forwardRef but dynamic() might be interfering
  // However, we are currently not using menuRef.current anywhere in this file.
  // If we need it later, we'll need to ensure the dynamic component handles it.

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });
    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      if (!webringSpin.current) return;
      // scroll down = fast-forward, up = reverse; idle velocity≈0 → normal speed
      webringSpin.current.timeScale(gsap.utils.clamp(-20, 20, 1 + velocity * 1.2));
    });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  return <>
    {/* debug session */}
    {process.env.NODE_ENV === "development" && (
      <div className="fixed bottom-0 left-0 w-full h-full z-[1000] pointer-events-none">
        <div className="absolute bottom-10 left-10 pointer-events-auto">
          <button 
            onClick={() => setIsDebugSession(prev => !prev)} 
            className={`bg-[#225]/80 hover:bg-[#336] p-2.5 rounded-full border border-white/20 backdrop-blur-sm transition-all shadow-lg hover:scale-110 active:scale-95 group ${isDebugSession ? 'ring-2 ring-blue-400' : ''}`}
            title={isDebugSession ? "Close Debug Session" : "Open Debug Session"}
          >
            {isDebugSession ? (
              <BugOff size={20} className="text-white group-hover:rotate-12 transition-transform" />
            ) : (
              <Bug size={20} className="text-white group-hover:rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    )}

    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={25}
      sparkCount={8}
      duration={400}
      className="!min-h-[100dvh] flex flex-col"
    >
      <ShootingStars className={"-z-10 transition-all duration-[1.5s] " + (isReady ? "opacity-100" : "opacity-0")} parallaxSpeed={0.05} />
      <StarsBackground className={"-z-10 transition-all duration-[1.5s] " + (isReady ? "opacity-100" : "opacity-0")} parallaxSpeed={0.1} mouseMoveParallaxSpeed={0.0025} />
      <GradualBlur
        target="page"
        position="top"
        height="7rem"
        strength={2}
        divCount={5}
        exponential
        opacity={1}
        zIndex={1}
      />
      {/* nav side */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-all delay-150 duration-[0.6s]" style={{zIndex: 1001, filter: isReady ? 'blur(0px)': 'blur(10px)', opacity: isReady ? 1 : 0}}>
        <StaggeredMenu
            position="right"
            items={menuItems as any}
            socialItems={contactUrls.filter((item) => !item.hideFromSidebar).map((item) => ({ label: item.name, link: item.url, icon: item.icon })) as any}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={true}
            colors={['#9eccef', '#27a1ff']}
            logoUrl="https://avatars.githubusercontent.com/u/48130528"
            accentColor="#27a1ff"
            onMenuOpen={() => setIsMenuOpenned(true)}
            onMenuClose={() => setIsMenuOpenned(false)}
            className={""}
            logoElement={<div className="flex items-center gap-4">
              <LinkTransition href="/" className="text-white">
                <Image priority src="https://avatars.githubusercontent.com/u/48130528" width={250} height={250} alt="Profile" className={"w-14 h-14 rounded-full mb-4 border-2 border-blue-300/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"} />
              </LinkTransition>
              <Link href="https://webring.wonderful.software#plutopon.me" title="วงแหวนเว็บ" className="relative block">
                <Image
                  alt="วงแหวนเว็บ"
                  width="32"
                  height="32"
                  src="https://webring.wonderful.software/webring.white.svg"
                  className="mb-4 webring-spin"
                  onMouseEnter={handleWebringEnter}
                  onMouseLeave={handleWebringLeave}
                />
                <Image
                  alt="วงแหวนเว็บ"
                  width="32"
                  height="32"
                  src="https://webring.wonderful.software/webring.black.svg"
                  className={`mb-4 webring-spin absolute top-0 left-0 xl:hidden ${!isMenuOpenned ? 'opacity-0 delay-[200ms]' : 'opacity-100 delay-[300ms]'} transition-opacity duration-[200ms]`}
                  onMouseEnter={handleWebringEnter}
                  onMouseLeave={handleWebringLeave}
                />
              </Link>
            </div>}
        />
      </div>
      <div 
        className={"flex flex-col flex-grow transition-all duration-[1s] delay-[400ms] " + (isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
      >
          {children}
          {whitelist_footer.includes(pathname) && <FooterSection />}
      </div>
    </ClickSpark>
  </>
}
