"use client"
import WordLoader from "@/components/WordLoader";
import Link from "next/link";
import { aka, contactUrls, introduce_data } from "@/lib/globalvariant";
import { useDebugStore } from "@/lib/store";

export default function HeaderSection() {
  const { isDebugSession } = useDebugStore();

  return (
    <>
      {/* hello section */}
      <div className="pt-32">
        {/* <Image src="https://avatars.githubusercontent.com/u/48130528" width={250} height={250} alt="Profile" className={"w-14 h-14 rounded-full mb-4 border-2 border-blue-300/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"} /> */}
        <h2 className="animate-split-down">Hello</h2>
        <div className="gap-4 grid grid-cols-[auto,1fr] text-4xl">
          <h1 className="animate-split-down">
            I am
          </h1>
          {/* text loading animation */}
          {process.env.NODE_ENV === "development" && isDebugSession ?
          (
            <h1 className="text-4xl font-bold animate-split-down">Ponlawat Paraban</h1>
          )
          :
          (
            <div className="animate-split-down">
              <WordLoader
                words={aka}
                className="text-4xl"
                textClassName="bg-gradient-to-b from-blue-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* about section */}
      <div className="mt-8 space-y-4">
        {introduce_data.description.split("\n").map((line, index) => (
          <p key={index} className="animate-split-down">{line}</p>
        ))}

        {/* contact links */}
        <div className="flex gap-4 pt-4 animate-split-down">
          {contactUrls.map((contact) => (
            <Link
              key={contact.name}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 group hover:text-blue-300 transition-colors duration-150 cursor-target"
              title={contact.name}
            >
              <span className="flex items-center gap-3">{contact.icon} {contact.name}</span>
              <span className="transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
