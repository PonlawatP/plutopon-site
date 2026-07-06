import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost, getPostSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { renderMarkdown } from "@/lib/blog/markdown";
import LinkTransition from "@/components/LinkTransition";
import { locales } from "@/lib/i18n/config";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return locales.flatMap((lang) => slugs.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function formatRelative(value?: string) {
  if (!value) return "";
  let duration = (new Date(value).getTime() - Date.now()) / 1000;
  for (const { amount, unit } of DIVISIONS) {
    if (Math.abs(duration) < amount) return rtf.format(Math.round(duration), unit);
    duration /= amount;
  }
  return "";
}

export default async function PostPage({ params }: { params: { lang: string; slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const content =
    typeof post.body === "string" ? await renderMarkdown(post.body) : null;

  const coverSrc =
    post.coverUrl ||
    (post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : null);
  const authorImg = post.author?.image
    ? urlFor(post.author.image).width(48).height(48).url()
    : null;

  return (
    <article className="pt-6 pb-12 max-lg:mx-8">
      <LinkTransition
        href={`/${params.lang}/blog`}
        className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-150 animate-split-down"
      >
        ← Back to blog
      </LinkTransition>

      <h1 className="mt-4 text-3xl font-bold animate-split-down">{post.title}</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400 animate-split-down">
        {authorImg ? (
          <Image
            src={authorImg}
            width={24}
            height={24}
            alt={post.author?.name ?? ""}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : null}
        {post.author?.name ? (
          <span className="text-gray-300">{post.author.name}</span>
        ) : null}
        {post.publishedAt ? (
          <time dateTime={post.publishedAt} title={formatDate(post.publishedAt)}>
            {post.author?.name ? "· " : ""}published {formatRelative(post.publishedAt)}
          </time>
        ) : null}
      </div>

      {coverSrc ? (
        <Image
          src={coverSrc}
          width={1200}
          height={630}
          alt={post.title}
          placeholder={post.mainImage?.asset?.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={post.mainImage?.asset?.metadata?.lqip}
          className="mt-6 aspect-video w-full rounded-lg object-cover animate-split-down"
          priority
        />
      ) : null}

      <div className="md-content mt-6 animate-split-down">{content}</div>
    </article>
  );
}
