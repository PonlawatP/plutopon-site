"use client"
import WordLoader from "@/components/WordLoader";
import Link from "next/link";
import { aka, contactUrls, introduce_data } from "@/lib/globalvariant";
import { useDebugStore } from "@/lib/store";
import LinkTransition from "../LinkTransition";

export default function HeaderSection({ show = true }: { show?: boolean }) {
  const { isDebugSession } = useDebugStore();

  return (
    // grid-rows 1fr->0fr collapses height smoothly; opacity fades. Both run on hide.
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pt-24"
      }`}
    >
      <div className="overflow-hidden min-h-0">
      {/* hello section */}
      <div className="pt-32 flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* <Image src="https://avatars.githubusercontent.com/u/48130528" width={250} height={250} alt="Profile" className={"w-14 h-14 rounded-full mb-4 border-2 border-blue-300/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"} /> */}
        <h2 className="animate-split-down mb-2">Hello</h2>
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-3 max-md:text-2xl text-4xl lg:text-5xl font-bold">
          <h1 className="animate-split-down whitespace-nowrap leading-none">
            I am
          </h1>
          {/* text loading animation */}
          {process.env.NODE_ENV === "development" && isDebugSession ?
          (
            <h1 className="animate-split-down leading-none tracking-[6px]">Ponlawat Paraban</h1>
          )
          :
          (
            <div className="animate-split-down flex items-center">
              <WordLoader
                words={aka}
                className="max-md:text-2xl text-4xl lg:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]"
                textClassName="bg-gradient-to-b from-blue-300 to-blue-400 bg-clip-text text-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* about section */}
      <div className="mt-8 space-y-4 max-lg:mx-8 max-lg:text-center">
        {introduce_data.description.split("\n").map((line, index) => (
          <p key={index} className="animate-split-down">{line}</p>
        ))}

        {/* contact links */}
        <div className="max-lg:justify-center flex flex-wrap gap-4 pt-4 animate-split-down">
          {contactUrls.map((contact) => (
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
