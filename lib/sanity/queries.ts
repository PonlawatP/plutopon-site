import { groq } from "next-sanity";

import { client } from "./client";

// Dev: bypass Next's data cache so content edits appear on refresh.
// Prod: ISR-style revalidate (60s) for performance.
const isDev = process.env.NODE_ENV !== "production";
const fetchOptions = isDev
  ? ({ cache: "no-store" } as const)
  : ({ next: { revalidate: 60 } } as const);

function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  return client.fetch<T>(query, params, fetchOptions);
}

export type Author = {
  name?: string;
  image?: any;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  preview?: string;
  coverUrl?: string;
  mainImage?: any;
  publishedAt?: string;
  author?: Author;
};

export type Post = PostListItem & {
  // body is authored as a Markdown string in Sanity
  body?: string;
};

const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, "preview": body, coverUrl, mainImage, publishedAt,
  author->{name, image}
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, coverUrl, mainImage, publishedAt, body,
  author->{name, image}
}`;

const slugsQuery = groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;

export function getPosts() {
  return sanityFetch<PostListItem[]>(postListQuery);
}

export function getPost(slug: string) {
  return sanityFetch<Post | null>(postBySlugQuery, { slug });
}

export function getPostSlugs() {
  return sanityFetch<{ slug: string }[]>(slugsQuery);
}

type Localized = { en?: string; th?: string };

export type Project = {
  _id: string;
  title?: Localized;
  description?: Localized;
  url: string;
  logoUrl?: string;
  logo?: any;
  tags?: string[];
};

const projectListQuery = groq`*[_type == "project"] | order(order asc){
  _id, title, description, url, logoUrl, logo, tags
}`;

export function getProjects() {
  return sanityFetch<Project[]>(projectListQuery);
}

const uiStringsQuery = groq`*[_type == "uiStrings"][0]`;

export function getUiStrings() {
  return sanityFetch<Record<string, any> | null>(uiStringsQuery);
}

export type HeaderTab = {
  label?: string;
  url: string;
  icon: string;
};

export type HeaderData = {
  aliases?: string;
  description?: string;
  tabs?: HeaderTab[];
};

// Locale-resolved header content for the portfolio hero.
// $lang selects the localized leaf, falling back to English.
const headerQuery = groq`*[_type == "uiStrings"][0]{
  "aliases": coalesce(header.aliases[$lang], header.aliases.en),
  "description": coalesce(header.description[$lang], header.description.en),
  "tabs": header.tabs[]{
    "label": coalesce(label[$lang], label.en),
    url,
    icon
  }
}`;

export function getHeader(lang: string) {
  return sanityFetch<HeaderData | null>(headerQuery, { lang });
}
