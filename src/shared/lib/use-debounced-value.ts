import { useEffect, useState } from "react";

/**
 * Debounces a value by `delayMs`. The old codebase debounced by wrapping
 * every `fetchData()` call in its own `setTimeout(..., 300)` / `clearTimeout`
 * pair (duplicated in 4 files). Debouncing the *input value* instead means
 * the debounce logic lives in exactly one place, and query keys derived
 * from the debounced value stay stable, which TanStack Query relies on for
 * caching and request de-duplication.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
