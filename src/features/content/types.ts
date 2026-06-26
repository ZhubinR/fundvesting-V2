export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  content: string;
  date_created: string;
}

export type PostCollection = "blog" | "posts";

/** A CMS-managed row from the `vazn_custom` Directus collection, used by
 * the homepage gold-weight comparison chart. Directus doesn't enforce a
 * schema we can statically know ahead of time, so this only types the
 * fields the chart actually reads. */
export interface GoldWeightOption {
  date: string;
  name: string;
  shemsh: number | null;
  seke: number | null;
}
