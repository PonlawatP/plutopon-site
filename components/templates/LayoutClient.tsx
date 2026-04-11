"use client"
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    new Lenis({
      autoRaf: true,
    });
  }, []);

  return <>
    {/* debug session */}
    {process.env.NODE_ENV && process.env.NODE_ENV === "development" && (
      <div className="border-red-500 border border-dashed rounded-md p-4 text-white text-center fixed bottom-4 left-4 z-30">
        <button className={"px-4 py-2 rounded-md " + (isDebugSession ? "bg-red-500/40 text-white" : "bg-blue-500/40 text-white")} onClick={() => setIsDebugSession((prev) => !prev)}>{isDebugSession ? "E" : "S"}</button>
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
      <ShootingStars className="-z-10" parallaxSpeed={0.05} />
      <StarsBackground className="-z-10" parallaxSpeed={0.1} />
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
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{zIndex: 1001}}>
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
            className={"pointer-events-auto"}
            logoElement={
              <LinkTransition href="/" className="text-white">
                <Image src="https://avatars.githubusercontent.com/u/48130528" width={250} height={250} alt="Profile" className={"w-14 h-14 rounded-full mb-4 border-2 border-blue-300/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"} />
              </LinkTransition>
          }
        />
      </div>
      {children}
      <FooterSection />
    </ClickSpark>
  </>
}
