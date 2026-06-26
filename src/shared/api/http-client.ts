import { HttpError } from "./http-error";

interface FetchJsonOptions extends RequestInit {
  /** Abort the request after this many milliseconds (default 10s). */
  timeoutMs?: number;
}

/**
 * Single fetch entry point for the whole app.
 *
 * The legacy code called `fetch` directly in ~10 different places with
 * slightly different error handling each time (some swallowed errors,
 * some didn't check `res.ok` at all). Centralizing it here means every
 * caller gets the same behaviour: a typed result, a typed error on
 * non-2xx responses, and a request timeout so a stalled backend can't
 * hang a page forever.
 */
export async function fetchJson<T>(
  url: string,
  { timeoutMs = 10_000, ...init }: FetchJsonOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: init.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new HttpError(response.status, url);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function postJson<T>(
  url: string,
  body: unknown,
  init: FetchJsonOptions = {},
): Promise<T> {
  return fetchJson<T>(url, {
    ...init,
    method: "POST",
    body: JSON.stringify(body),
  });
}
