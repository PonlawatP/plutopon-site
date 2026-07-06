"use client"
import { ReactNode, useMemo } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaBlog, FaFileAlt } from "react-icons/fa";
import WordLoader from "@/components/WordLoader";
import { aka, contactUrls, introduce_data } from "@/lib/globalvariant";
import { useDebugStore } from "@/lib/store";
import type { HeaderData, HeaderTab } from "@/lib/sanity/queries";
import LinkTransition from "../LinkTransition";

// Sanity icon keys -> react-icons component
const ICON_MAP: Record<string, ReactNode> = {
  resume: <FaFileAlt className="w-6 h-6" />,
  email: <FaEnvelope className="w-6 h-6" />,
  linkedin: <FaLinkedin className="w-6 h-6" />,
  github: <FaGithub className="w-6 h-6" />,
  blog: <FaBlog className="w-6 h-6" />,
};

type Contact = { name: string; url: string; icon: ReactNode };

export default function HeaderSection({
  show = true,
  header,
}: {
  show?: boolean;
  header?: HeaderData | null;
}) {
  const { isDebugSession } = useDebugStore();

  // aliases: comma-separated names -> animated word loader. Fallback to hardcoded.
  // useMemo keeps array identity stable so WordLoader's GSAP effect doesn't re-run each render.
  const names = useMemo(() => {
    const words =
      header?.aliases
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    return words.length ? words : aka;
  }, [header?.aliases]);

  // description: blank-line/newline separated paragraphs. Fallback to hardcoded.
  const description = header?.description?.trim() || introduce_data.description;

  // tabs: Sanity contact tabs -> {name, url, icon}. Fallback to globalvariant.
  const sanityTabs = (header?.tabs ?? []).filter(
    (t): t is HeaderTab => !!t?.url && !!ICON_MAP[t.icon]
  );
  const contacts: Contact[] = sanityTabs.length
    ? sanityTabs.map((t) => ({
        name: t.label || t.icon,
        url: t.url,
        icon: ICON_MAP[t.icon],
      }))
    : contactUrls.map((c) => ({ name: c.name, url: c.url, icon: c.icon }));

  return (
    // grid-rows 1fr->0fr collapses height smoothly; opacity fades. Both run on hide.
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pt-24"
      }`}
    >
      <div className="min-h-0">
      {/* hello section */}
      <div className="pt-32 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h2 className="animate-split-down mb-2">Hello</h2>
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-3 max-md:text-2xl text-4xl lg:text-5xl font-bold">
          <h1 className="animate-split-down whitespace-nowrap leading-none">
            I am
          </h1>
          {/* text loading animation */}
          {process.env.NODE_ENV === "development" && isDebugSession ?
          (
            <h1 className="animate-split-down leading-none tracking-[6px]">{names[0]}</h1>
          )
          :
          (
            <div className="animate-split-down flex items-center">
              <WordLoader
                words={names}
                className="max-md:text-2xl text-4xl lg:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]"
                textClassName="bg-gradient-to-b from-blue-300 to-blue-400 bg-clip-text text-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* about section */}
      <div className="mt-8 space-y-4 max-lg:mx-8 max-lg:text-center">
        {description.split("\n").map((line, index) => (
          <p key={index} className="animate-split-down">{line}</p>
        ))}

        {/* contact links */}
        <div className="max-lg:justify-center flex flex-wrap gap-4 pt-4 animate-split-down">
          {contacts.map((contact) => (
            <LinkTransition
              key={contact.name}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 group hover:text-blue-300 transition-colors duration-150 cursor-target"
              title={contact.name}
            >
              <span className="flex items-center gap-3">{contact.icon} {contact.name}</span>
              <span className="transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
            </LinkTransition>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
