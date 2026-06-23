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

const imageFields = groq`mainImage{ ..., asset->{ ..., metadata { lqip } } }`;

const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, ${imageFields}, publishedAt
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, ${imageFields}, publishedAt, body
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

export type Project = {
  _id: string;
  title: string;
  description?: string;
  url: string;
  logo?: any;
  tags?: string[];
};

const logoFields = groq`logo{ ..., asset->{ ..., metadata { lqip } } }`;

const projectListQuery = groq`*[_type == "project"] | order(order asc, title asc){
  _id, title, description, url, ${logoFields}, tags
}`;

export function getProjects() {
  return client.fetch<Project[]>(projectListQuery);
}

const uiStringsQuery = groq`*[_type == "uiStrings"][0]`;

export function getUiStrings() {
  return client.fetch<Record<string, any> | null>(uiStringsQuery);
}
