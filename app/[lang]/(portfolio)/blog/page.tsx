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
            const preview = post.excerpt || post.preview;
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
