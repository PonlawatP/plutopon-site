import { groq } from "next-sanity";

import { client } from "./client";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: any;
  publishedAt?: string;
};

export type Post = PostListItem & {
  body?: any[];
};

const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, mainImage, publishedAt
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, body
}`;

const slugsQuery = groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;

export function getPosts() {
  return client.fetch<PostListItem[]>(postListQuery);
}

export function getPost(slug: string) {
  return client.fetch<Post | null>(postBySlugQuery, { slug });
}

export function getPostSlugs() {
  return client.fetch<{ slug: string }[]>(slugsQuery);
}

const uiStringsQuery = groq`*[_type == "uiStrings"][0]`;

export function getUiStrings() {
  return client.fetch<Record<string, any> | null>(uiStringsQuery);
}
