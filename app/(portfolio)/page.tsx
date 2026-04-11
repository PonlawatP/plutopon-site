"use client"
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/globalvariant";
import ProjectsPage from "./projects/page";

export default function Home() {

  return (<>
      {/* showcase section */}
      <ProjectsPage />
    </>
  );
}
