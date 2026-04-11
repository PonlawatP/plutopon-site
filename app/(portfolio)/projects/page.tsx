"use client"
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/globalvariant";

export default function ProjectsPage() {

  return (<>
      {/* showcase section */}
      <div className="pt-6 space-y-4">
        <h2 className="text-2xl font-bold animate-split-down">Showcase</h2>
        {/* showcase content */}
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div key={index} className="cursor-target animate-split-down">
              <Link href={project.url} target="_blank" rel="noopener noreferrer" className="relative group flex items-center hover:text-blue-300 transition-colors duration-150">
                <Image src={project.logo} width={60} height={60} alt={project.title} className="w-6 h-6 rounded-sm mr-2" />  
                <div className="relative w-fit pr-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className="absolute bottom-0 left-0 transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
                </div>
              </Link>
              <p className="text-gray-300 mt-2">
                {project.description}
              </p>
              {/* chip tags */}
              <div className="flex gap-2 mt-2 text-base">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-blue-300/20 text-white px-3 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
