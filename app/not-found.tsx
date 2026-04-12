"use client"
import LinkTransition from "@/components/LinkTransition";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main id="page-content" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center gap-12">
        <div className="relative">
          <h2 className="animate-split-down absolute -top-6 right-0">Lets find something else</h2>
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-3 max-md:text-2xl text-4xl lg:text-5xl font-bold">
            <h1 className="animate-split-down whitespace-nowrap leading-none">
              404 Not Found
            </h1>
          </div>
        </div>
        <LinkTransition
          href={"/"}
          className="text-gray-400 group hover:text-blue-300 transition-colors duration-150 cursor-target"
        >
          <span className="flex items-center gap-3"><Home /> Home</span>
          <span className="transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
        </LinkTransition>
    </main>
  );
}