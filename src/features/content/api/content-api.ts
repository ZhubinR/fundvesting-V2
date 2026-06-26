import { env } from "@/shared/lib/env";
import { withDemoFallback, type FallbackResult } from "@/shared/lib/with-demo-fallback";
import { generateMockGoldWeightOptions, generateMockPost, generateMockPosts } from "../mocks";
import type { GoldWeightOption, Post, PostCollection } from "../types";

interface DirectusListResponse<T> {
  data: T[];
}

const REVALIDATE_SECONDS = 60;

function collectionUrl(collection: PostCollection): string {
  return `${env.CONTENT_API_ORIGIN}/items/${collection}`;
}

export function thumbnailUrl(thumbnail: string | null): string | undefined {
  return thumbnail ? `${env.CONTENT_API_ORIGIN}/assets/${thumbnail}` : undefined;
}

function sortByNewestFirst(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

/** All posts in a collection, newest first. Falls back to placeholder
 * posts if the CMS can't be reached — see `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK`. */
export async function fetchPosts(collection: PostCollection): Promise<FallbackResult<Post[]>> {
  return withDemoFallback(
    async () => {
      const json = await fetchJson<DirectusListResponse<Post>>(collectionUrl(collection));
      return sortByNewestFirst(json.data ?? []);
    },
    () => generateMockPosts(collection),
    `${collection} posts`,
  );
}

/** A single post by slug, or `null` if the CMS responded but had no match
 * (a real "not found" — distinct from the CMS being unreachable, which
 * falls back to a placeholder post instead of a 404). */
export async function fetchPostBySlug(
  collection: PostCollection,
  slug: string,
): Promise<FallbackResult<Post | null>> {
  return withDemoFallback(
    async () => {
      const url = `${collectionUrl(collection)}?filter[slug]=${encodeURIComponent(slug)}`;
      const json = await fetchJson<DirectusListResponse<Post>>(url);
      return json.data?.[0] ?? null;
    },
    () => generateMockPost(collection, slug),
    `${collection} post "${slug}"`,
  );
}

export async function fetchPostSlugs(collection: PostCollection): Promise<string[]> {
  const { value: posts } = await fetchPosts(collection);
  return posts.map((post) => post.slug);
}

/**
 * The most recent posts excluding one slug, for the "latest news" sidebar.
 * The original computed this as `otherPosts.slice(-5)` on a list that was
 * never explicitly sorted by date (only the *listing* page sorted; this
 * helper's data source did not) — it relied on Directus's default
 * (insertion/id) order happening to match chronological order. Sorting by
 * `date_created` explicitly here gets the same practical result without
 * that implicit assumption.
 */
export async function fetchRelatedPosts(
  collection: PostCollection,
  excludeSlug: string,
  limit = 5,
): Promise<Post[]> {
  const { value: posts } = await fetchPosts(collection);
  return posts.filter((post) => post.slug !== excludeSlug).slice(0, limit);
}

/** The CMS-managed gold-weight reference data shown on the homepage. */
export async function fetchGoldWeightOptions(): Promise<FallbackResult<GoldWeightOption[]>> {
  return withDemoFallback(
    async () => {
      const json = await fetchJson<DirectusListResponse<GoldWeightOption>>(
        `${env.CONTENT_API_ORIGIN}/items/vazn_custom`,
      );
      return json.data ?? [];
    },
    () => generateMockGoldWeightOptions(),
    "gold weight options",
  );
}
