import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { getPost, getPostSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="pt-6 max-lg:mx-8">
      <Link
        href="/blog"
        className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-150 animate-split-down"
      >
        ← Back to blog
      </Link>

      <h1 className="mt-4 text-3xl font-bold animate-split-down">{post.title}</h1>
      <p className="mt-1 text-sm text-gray-400 animate-split-down">
        {formatDate(post.publishedAt)}
      </p>

      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(1200).height(630).url()}
          width={1200}
          height={630}
          alt={post.title}
          className="mt-6 aspect-video w-full rounded-lg object-cover animate-split-down"
          priority
        />
      ) : null}

      <div className="mt-6 animate-split-down">
        {post.body ? (
          <PortableText value={post.body} components={portableTextComponents} />
        ) : null}
      </div>
    </article>
  );
}
