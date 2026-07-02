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

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  preview?: string;
  mainImage?: any;
  publishedAt?: string;
};

export type Post = PostListItem & {
  // body is authored as a Markdown string in Sanity
  body?: string;
};

const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, "preview": body, mainImage, publishedAt
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, body
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
