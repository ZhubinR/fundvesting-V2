import { env } from "./env";

export interface FallbackResult<T> {
  value: T;
  /** True when `value` is placeholder data because the real fetch failed. */
  isDemo: boolean;
}

/**
 * Runs `load()`. If it throws — the backend is unreachable, returned a
 * server error, etc. — and demo fallback is enabled, returns `fallback()`
 * instead, tagged so callers can show a "showing sample data" notice
 * rather than silently presenting it as real.
 *
 * Set `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=false` to disable this and let
 * failures propagate as real errors (e.g. for an environment where a
 * blank/error state is preferable to ever showing placeholder numbers).
 */
export async function withDemoFallback<T>(
  load: () => Promise<T>,
  fallback: () => T,
  label: string,
): Promise<FallbackResult<T>> {
  try {
    return { value: await load(), isDemo: false };
  } catch (error) {
    if (!env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK) throw error;
    console.warn(`[demo-fallback] ${label}: live fetch failed, showing placeholder data instead.`, error);
    return { value: fallback(), isDemo: true };
  }
}
