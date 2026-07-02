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
  // aliases stored as comma-separated string in Sanity uiStrings (group "blogMeta", key "aliases")
  const aliases = (dict["blogMeta.aliases"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    title: dict["blogMeta.title"] ?? "Blog",
    description:
      dict["blogMeta.description"] ??
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
        <div className="grid lg:grid-cols-2 max-lg:gap-8 gap-4">
          {posts.map((post) => {
            const preview = post.excerpt || stripMarkdown(post.preview);
            return <LinkTransition
              key={post._id}
              href={`/${params.lang}/blog/${post.slug}`}
              className="cursor-target group relative block animate-split-down hover:text-blue-300 transition-colors duration-150"
            >
              {post.mainImage ? (
                <Image
                  src={urlFor(post.mainImage).width(800).height(450).url()}
                  width={800}
                  height={450}
                  alt={post.title}
                  placeholder={post.mainImage.asset?.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={post.mainImage.asset?.metadata?.lqip}
                  className="mb-3 aspect-video w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="relative w-fit">
                <h3 className="text-xl font-bold transition-colors duration-150 group-hover:text-blue-300">{post.title}</h3>
                  <span className="absolute bottom-0 left-0 transition-all duration-150 ease-out block mt-2 w-0 h-[2px] bg-blue-300 group-hover:w-full"></span>
              </div>
              <div className="relative w-full">
                {preview ? (
                  <p className="text-gray-300 line-clamp-2">{preview}</p>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-gray-400">{formatDate(post.publishedAt)}</p>
              {post.excerpt ? (
                <p className="mt-2 text-gray-300">{post.excerpt}</p>
              ) : null}
            </LinkTransition>
          })}
        </div>
      )}
    </div>
  );
}
