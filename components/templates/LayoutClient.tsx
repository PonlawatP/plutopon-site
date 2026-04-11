"use client"
import { useEffect, useRef, useState } from "react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { contactUrls, menuItems } from "@/lib/globalvariant";
import Image from "next/image";
import { useDebugStore } from "@/lib/store";
import FooterSection from "./FooterSection";
import Lenis from 'lenis'
import Link from "next/link";
import LinkTransition from "../LinkTransition";
import { ShootingStars } from "../shooting-stars";
import ClickSpark from "@/components/ClickSpark";
import { StarsBackground } from "../stars-background";
import GradualBlur from "@/components/GradualBlur";


export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDebugSession, setIsDebugSession } = useDebugStore();
  const menuRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    new Lenis({
      autoRaf: true,
    });
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return <>
    {/* debug session */}
    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={25}
      sparkCount={8}
      duration={400}
      className="!min-h-[100dvh] flex flex-col"
    >
      <ShootingStars className="-z-10" parallaxSpeed={0.05} />
      <StarsBackground className={"-z-10 transition-all duration-[1.5s]" + (isReady ? " opacity-100" : " opacity-0")} parallaxSpeed={0.1} mouseMoveParallaxSpeed={0.0025} />
      <GradualBlur
        target="page"
        position="top"
        height="7rem"
        strength={2}
        divCount={5}
        curve="ease-in"
        exponential
        opacity={1}
        zIndex={1}
      />
      {/* nav side */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-all delay-150 duration-[0.6s]" style={{zIndex: 1001, filter: isReady ? 'blur(0px)': 'blur(10px)', opacity: isReady ? 1 : 0}}>
        <StaggeredMenu
          ref={menuRef}
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
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
            className={""}
            logoElement={
              <LinkTransition href="/" className="text-white">
                <Image src="https://avatars.githubusercontent.com/u/48130528" width={250} height={250} alt="Profile" className={"w-14 h-14 rounded-full mb-4 border-2 border-blue-300/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"} />
              </LinkTransition>
          }
        />
      </div>
      {isReady && <>
          {children}
          <FooterSection />
        </>
      }
    </ClickSpark>
  </>
}
