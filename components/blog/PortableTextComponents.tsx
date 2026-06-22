import Image from "next/image";
import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

import { urlFor } from "@/lib/sanity/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <Image
          src={urlFor(value).width(1200).fit("max").url()}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className="my-6 h-auto w-full rounded-lg"
        />
      );
    },
    code: ({ value }) => {
      if (!value?.code) return null;
      return (
        <pre className="my-6 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm">
          {value.filename ? (
            <div className="mb-2 text-xs text-gray-400">{value.filename}</div>
          ) : null}
          <code className={value.language ? `language-${value.language}` : undefined}>
            {value.code}
          </code>
        </pre>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-blue-300 underline underline-offset-2 hover:text-blue-400"
        >
          {children}
        </Link>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-8 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 text-xl font-bold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-blue-300 pl-4 text-gray-300">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-4 text-gray-300">{children}</p>,
  },
};
