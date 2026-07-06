import { type ReactElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import Link from "next/link";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import { visit } from "unist-util-visit";

import Mermaid from "@/components/blog/Mermaid";

/**
 * Rehype plugin: pull ```mermaid fences out of the code path BEFORE
 * rehype-pretty-code touches them (mermaid is not a shiki grammar).
 * Replaces the <pre><code class="language-mermaid"> node with a custom
 * <mermaid> element carrying the raw source, mapped to the client renderer.
 */
function rehypeMermaid() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const code = node.children?.find(
        (c: any) => c.type === "element" && c.tagName === "code"
      );
      if (!code) return;
      const cls = code.properties?.className;
      const classes = Array.isArray(cls)
        ? cls
        : typeof cls === "string"
        ? cls.split(" ")
        : [];
      if (!classes.includes("language-mermaid")) return;
      const value = (code.children ?? [])
        .map((c: any) => (c.type === "text" ? c.value : ""))
        .join("");
      parent.children[index] = {
        type: "element",
        tagName: "mermaid",
        properties: {},
        children: [{ type: "text", value }],
      };
    });
  };
}

const components: Record<string, any> = {
  a: ({ href = "#", children }: any) => {
    const external = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  },
  mermaid: ({ children }: any) => {
    const chart = Array.isArray(children) ? children.join("") : String(children ?? "");
    return <Mermaid chart={chart} />;
  },
};

const production = {
  Fragment: (jsxRuntime as any).Fragment,
  jsx: (jsxRuntime as any).jsx,
  jsxs: (jsxRuntime as any).jsxs,
  components,
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm) // tables, task lists, strikethrough, autolinks, footnotes
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw) // allow inline raw HTML in markdown
  .use(rehypeMermaid)
  .use(rehypePrettyCode, {
    theme: "github-dark",
    keepBackground: true,
    defaultLang: "plaintext",
  })
  .use(rehypeReact, production as any);

export async function renderMarkdown(md: string): Promise<ReactElement> {
  const file = await processor.process(md);
  return file.result as ReactElement;
}
