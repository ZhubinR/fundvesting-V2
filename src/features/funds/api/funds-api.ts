import { postJson } from "@/shared/api/http-client";
import { MARKET_AUTH_TOKEN } from "../constants";
import type { FundDataPoint, FundMetricKey, FundSymbol } from "../types";

export interface FetchFundSeriesParams {
  symbols: readonly FundSymbol[] | readonly ["*"];
  metrics: readonly FundMetricKey[];
  /** Either provide `intervalDays`, or both `from` and `to` — not both.
   * Any positive day count is valid; the 4 preset time-frame buttons in
   * the UI (`TimeFrameDays`) are just the common cases. */
  intervalDays?: number;
  from?: string | null;
  to?: string | null;
}

interface FundSeriesResponse {
  data: FundDataPoint[];
}

/**
 * Fetches historical fund data points from the market API.
 *
 * Replaces `services/getData.js`. Behaviour differences from the original:
 *  - throws a descriptive error instead of silently calling the API with
 *    `interval: undefined` when neither an interval nor a date range was
 *    given (the old code just logged a warning and returned early with
 *    stale state still in place).
 *  - the auth token is no longer a parameter every call site has to pass
 *    in manually; it's filled in here from the single shared constant.
 */
export async function fetchFundSeries(
  params: FetchFundSeriesParams,
): Promise<FundDataPoint[]> {
  const { symbols, metrics, intervalDays, from, to } = params;
  const hasRange = Boolean(from && to);

  if (!hasRange && !intervalDays) {
    throw new Error(
      "fetchFundSeries: provide either `intervalDays` or both `from` and `to`.",
    );
  }

  const response = await postJson<FundSeriesResponse>("/crawl", {
    token: MARKET_AUTH_TOKEN,
    fund: symbols,
    from: from ?? undefined,
    to: to ?? undefined,
    interval: hasRange ? undefined : intervalDays,
    query: metrics,
  });

  return response.data ?? [];
}
