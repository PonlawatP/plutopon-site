import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN caches responses ~60s. Disable in dev so new/edited posts show instantly.
  useCdn: process.env.NODE_ENV === "production",
});
