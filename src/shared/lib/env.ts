import { z } from "zod";

/**
 * All environment access for the app goes through here. Two benefits over
 * reading `process.env.X` ad-hoc around the codebase (the old pattern):
 *  1. Typos / missing vars fail fast at boot, not with a silent `undefined`
 *     three components deep.
 *  2. Defaults match the previous hardcoded production values, so the app
 *     still runs correctly with zero `.env` setup for local development.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://fundvesting.ir"),
  NEXT_PUBLIC_MARKET_WS_URL: z
    .string()
    .default("wss://fundvesting.liara.run/ws"),
  NEXT_PUBLIC_GA_ID: z.string().default("G-Q6GKVRR88J"),
  /** Directus content API origin — used server-side only (server components
   * can't resolve the relative `/panel/*` rewrite the way browser fetches
   * can, since there's no implicit base URL on the server). */
  CONTENT_API_ORIGIN: z.string().url().default("https://fundvesting-panel.liara.run"),
  /** When the real market/content API can't be reached, show realistic
   * placeholder data instead of a blank/error page — useful for demos,
   * screenshots, and local development without backend access. A clearly
   * labeled notice is shown wherever placeholder data is in use, so it's
   * never mistaken for live data. Set to "false" to disable and let
   * fetch failures surface as real errors instead. */
  NEXT_PUBLIC_ENABLE_DEMO_FALLBACK: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MARKET_WS_URL: process.env.NEXT_PUBLIC_MARKET_WS_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  CONTENT_API_ORIGIN: process.env.CONTENT_API_ORIGIN,
  NEXT_PUBLIC_ENABLE_DEMO_FALLBACK: process.env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK,
});

if (!parsed.success) {
  // Fails the build instead of shipping a client that silently fetches
  // `undefined`.
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = parsed.data;
