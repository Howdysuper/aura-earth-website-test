import "server-only";
import {
  getPosts as fbGetPosts,
  getPostBySlug as fbGetPostBySlug,
  seedPostsIfEmpty,
  isAdminConfigured,
  type Post,
} from "./firestore";
import { seedPosts } from "./seed-posts";

let seedPostsAttempted = false;

function fallbackPosts(): Post[] {
  return seedPosts.map((p, i) => ({
    ...p,
    id: String(i + 1),
    createdAt: new Date(),
    publishedAt: new Date(),
  }));
}

export async function getPosts(): Promise<Post[]> {
  if (!isAdminConfigured()) return fallbackPosts();
  try {
    const rows = await fbGetPosts();
    if (rows.length > 0) return rows;
    if (!seedPostsAttempted) {
      seedPostsAttempted = true;
      return seedPostsIfEmpty();
    }
    return [];
  } catch {
    return fallbackPosts();
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isAdminConfigured()) {
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  }
  try {
    const row = await fbGetPostBySlug(slug);
    if (row) return row;
    await getPosts();
    return fbGetPostBySlug(slug);
  } catch {
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  }
}
