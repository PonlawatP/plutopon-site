import Image from "next/image";
import Link from "next/link";

import { getProjects } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export const revalidate = 60;

const pick = (v: { en?: string; th?: string } | undefined, locale: Locale) =>
  v?.[locale] ?? v?.[defaultLocale] ?? "";

export default async function ProjectsPage({ params }: { params: { lang: string } }) {
  const locale: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const projects = await getProjects();

  return (<>
      {/* showcase section */}
      <div className="pt-6 pb-12 space-y-4 max-lg:mx-8">
        <h2 className="text-2xl font-bold animate-split-down">Showcase</h2>
        {/* showcase content */}
        <div className="grid lg:grid-cols-2 max-lg:gap-8 gap-4">
          {projects.map((project) => {
            const logoSrc = project.logoUrl || (project.logo ? urlFor(project.logo).width(60).height(60).url() : null);
            return (
            <div key={project._id} className="cursor-target relative animate-split-down">
              <Link href={project.url} target="_blank" rel="noopener noreferrer" className="relative group flex items-center hover:text-blue-300 transition-colors duration-150">
                {logoSrc ? (
                  <Image src={logoSrc} width={60} height={60} alt={pick(project.title, locale)} className="w-6 h-6 rounded-sm mr-2" />
                ) : null}
                <div className="relative w-fit pr-2">
                  <h3 className="text-xl font-bold">{pick(project.title, locale)}</h3>
                  <span className="absolute bottom-0 left-0 transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
                </div>
              </Link>
              <p className="text-gray-300 mt-2 mb-2 leading-relaxed">
                {pick(project.description, locale)}
              </p>
              {/* chip tags */}
              <div className="flex flex-wrap gap-2 mt-2 text-base relative">
                {(project.tags ?? []).map((tag) => (
                  <span key={tag} className="bg-blue-300/20 text-white px-3 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
