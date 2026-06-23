import Image from "next/image";
import Link from "next/link";

import { getPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import LinkTransition from "@/components/LinkTransition";

export const revalidate = 60;

export const metadata = {
  title: "Blog",
  description: "Writing on web development, design, and side projects.",
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-6 space-y-4 max-lg:mx-8">
      <h2 className="text-2xl font-bold animate-split-down">Blog</h2>

      {posts.length === 0 ? (
        <p className="text-gray-300 animate-split-down">No posts yet.</p>
      ) : (
        <div className="grid lg:grid-cols-2 max-lg:gap-8 gap-4">
          {posts.map((post) => (
            <LinkTransition
              key={post._id}
              href={`/blog/${post.slug}`}
              className="cursor-target group relative block animate-split-down hover:text-blue-300 transition-colors duration-150"
            >
              {post.mainImage ? (
                <Image
                  src={urlFor(post.mainImage).width(800).height(450).url()}
                  width={800}
                  height={450}
                  alt={post.title}
                  className="mb-3 aspect-video w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="relative w-fit pr-2">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <span className="absolute bottom-0 left-0 mt-2 block h-[2px] w-0 bg-blue-300 transition-all duration-150 ease-out group-hover:w-full"></span>
              </div>
              <p className="mt-1 text-sm text-gray-400">{formatDate(post.publishedAt)}</p>
              {post.excerpt ? (
                <p className="mt-2 text-gray-300">{post.excerpt}</p>
              ) : null}
            </LinkTransition>
          ))}
        </div>
      )}
    </div>
  );
}
