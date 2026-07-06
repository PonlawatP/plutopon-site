import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { getPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import LinkTransition from "@/components/LinkTransition";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(locale);
  // aliases stored as comma-separated string in Sanity uiStrings (group "header", key "aliases")
  const aliases = (dict["header.aliases"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    title: dict["general.title"] ?? "Blog",
    description:
      dict["general.description"] ??
      "Writing on web development, design, and side projects.",
    keywords: aliases.length ? aliases : ["Ponlawat Paraban", "Plutopon"],
  };
}

// Body is Markdown; strip syntax to a clean one-line teaser for the card.
function stripMarkdown(md?: string) {
  if (!md || typeof md !== "string") return "";
  return md
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
    .replace(/[*_~>#-]/g, " ") // leftover marks
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage({ params }: { params: { lang: string } }) {
  const posts = await getPosts();

  return (
    <div className="pt-6 space-y-4 max-lg:mx-8">
      <h2 className="text-2xl font-bold animate-split-down">Blog</h2>

      {posts.length === 0 ? (
        <p className="text-gray-300 animate-split-down">No posts yet.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {posts.map((post) => {
            const preview = post.excerpt || stripMarkdown(post.preview);
            const coverSrc =
              post.coverUrl ||
              (post.mainImage ? urlFor(post.mainImage).width(800).height(450).url() : null);
            const initial = post.title?.trim()?.charAt(0) || "•";
            return <LinkTransition
              key={post._id}
              href={`/${params.lang}/blog/${post.slug}`}
              className="cursor-target group flex items-start gap-4 py-5 animate-split-down sm:gap-5"
            >
              <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:w-44 md:w-52">
                {coverSrc ? (
                  <Image
                    src={coverSrc}
                    width={800}
                    height={450}
                    alt={post.title}
                    placeholder={post.mainImage?.asset?.metadata?.lqip ? "blur" : "empty"}
                    blurDataURL={post.mainImage?.asset?.metadata?.lqip}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400/25 via-indigo-500/10 to-slate-900/40 transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                    <span className="select-none text-3xl font-bold text-blue-100/40 sm:text-4xl">{initial}</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="relative inline-block max-w-full">
                  <h3 className="truncate text-lg font-bold transition-colors duration-150 group-hover:text-blue-300 sm:text-xl">{post.title}</h3>
                  <span className="absolute bottom-0 left-0 block h-[2px] w-0 bg-blue-300 transition-all duration-300 ease-out group-hover:w-full"></span>
                </div>
                {preview ? (
                  <p className="mt-1 line-clamp-2 leading-relaxed text-gray-300 max-sm:text-sm">{preview}</p>
                ) : null}
                <p className="mt-2 text-sm text-gray-400">{formatDate(post.publishedAt)}</p>
              </div>
            </LinkTransition>
          })}
        </div>
      )}
    </div>
  );
}
