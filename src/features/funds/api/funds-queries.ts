import { useQuery } from "@tanstack/react-query";
import { withDemoFallback } from "@/shared/lib/with-demo-fallback";
import { fetchFundSeries, type FetchFundSeriesParams } from "./funds-api";
import { generateMockFundSeries } from "../mocks";
import { FUND_SYMBOLS_BY_CATEGORY } from "../constants";
import type { FundCategory, FundDataPoint, FundMetricKey } from "../types";

/** A stable, shared reference so `points ?? EMPTY_FUND_SERIES` doesn't
 * create a new array on every render while a query has no data yet. */
export const EMPTY_FUND_SERIES: readonly FundDataPoint[] = [];

/** Default for `data ?? EMPTY_FUND_RESULT` while a query is loading. */
export const EMPTY_FUND_RESULT = { value: EMPTY_FUND_SERIES, isDemo: false } as const;

export function fundSeriesQueryKey(params: FetchFundSeriesParams) {
  return ["funds", "series", params] as const;
}

/**
 * Low-level hook: fetches whatever symbols/metrics/range you ask for.
 * `enabled` mirrors the validation `fetchFundSeries` itself performs, so
 * the query simply doesn't run instead of throwing while inputs are still
 * settling (e.g. only one of two date pickers has a value so far).
 *
 * If the real API can't be reached, falls back to realistic placeholder
 * data (see `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK`) and reports `isDemo: true`
 * so the page can show a notice.
 */
export function useFundSeries(params: FetchFundSeriesParams) {
  const hasRange = Boolean(params.from && params.to);
  const isReady = hasRange || Boolean(params.intervalDays);

  return useQuery({
    queryKey: fundSeriesQueryKey(params),
    queryFn: () =>
      withDemoFallback(
        () => fetchFundSeries(params),
        () => generateMockFundSeries(params),
        "fund series",
      ),
    enabled: isReady,
  });
}

export interface FundCategoryRange {
  intervalDays?: number;
  from?: string | null;
  to?: string | null;
}

/**
 * Fetches one fund category's (ahrom | gold) series for a given metric
 * set and time range. This is the hook every page-level feature
 * (compare, fund-bar, fund-trend) builds on. Crucially, each page only
 * fetches the category that's actually visible — switching tabs swaps the
 * query instead of always loading both categories on every keystroke,
 * which is what 3 of the 5 old pages effectively did via their full
 * `ahromSymbols` / `goldSymbols` literals being re-sent on every render.
 */
export function useFundCategorySeries(
  category: FundCategory,
  metrics: readonly FundMetricKey[],
  range: FundCategoryRange,
) {
  return useFundSeries({
    symbols: FUND_SYMBOLS_BY_CATEGORY[category],
    metrics,
    ...range,
  });
}
