"use client"

import LinkTransition from "@/components/LinkTransition";
import { Home, RefreshCcw } from "lucide-react";

interface ErrorViewProps {
  statusCode?: string | number;
  title?: string;
  message?: string;
  reset?: () => void;
}

export default function ErrorView({ 
  statusCode = "500", 
  title = "Error", 
  message = "Something went wrong on our end",
  reset 
}: ErrorViewProps) {
  return (
    <main id="page-content" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center gap-12 p-4">
      <div className="relative text-center max-w-2xl">
        <h2 className="animate-split-down absolute -top-10 left-0 right-0 mx-auto whitespace-nowrap text-blue-300/80 font-medium">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-x-3 max-md:text-4xl text-5xl lg:text-7xl font-bold">
          <h1 className="animate-split-down whitespace-nowrap leading-none">
            {statusCode}
          </h1>
        </div>
        <p className="mt-6 text-gray-400 text-lg animate-split-down opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
          {message}
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        {reset && (
          <button
            onClick={() => reset()}
            className="text-gray-400 group hover:text-blue-300 transition-colors duration-150 cursor-target flex flex-col items-center"
          >
            <span className="flex items-center gap-3"><RefreshCcw className="w-5 h-5" /> Try again</span>
            <span className="transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
          </button>
        )}
        
        <LinkTransition
          href={"/"}
          className="text-gray-400 group hover:text-blue-300 transition-colors duration-150 cursor-target flex flex-col items-center"
        >
          <span className="flex items-center gap-3"><Home className="w-5 h-5" /> Home</span>
          <span className="transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
        </LinkTransition>
      </div>
    </main>
  );
}
