import { AHROM_SYMBOLS, GOLD_SYMBOLS } from "./constants";

export type AhromSymbol = (typeof AHROM_SYMBOLS)[number];
export type GoldSymbol = (typeof GOLD_SYMBOLS)[number];
export type FundSymbol = AhromSymbol | GoldSymbol;

export type FundCategory = "ahrom" | "gold";

/**
 * Every value the market API can return for a fund, beyond `fund` and
 * `datapg` themselves. The old code requested these via a raw `string[]`
 * with no checking against what the API actually understands.
 */
export const FUND_METRIC_KEYS = [
  "fin_pr",
  "nav",
  "rl_levrat",
  "cl_levrat",
  "st_wg",
  "tr_val",
  "fin_bub",
  "net_wass",
  "id",
] as const;

export type FundMetricKey = (typeof FUND_METRIC_KEYS)[number];

/**
 * One row of historical fund data, as returned by `POST /crawl`.
 * Only `fund` and `datapg` are guaranteed; every metric is optional
 * because callers choose which metrics to request via `query`.
 */
export type FundDataPoint = {
  fund: FundSymbol;
  datapg: string;
} & Partial<Record<FundMetricKey, number | null>>;

export type TimeFrameDays = 2 | 31 | 91 | 184 | 366;

/** A single fund's snapshot in a realtime WebSocket tick. */
export interface MarketTick {
  last_pr?: number;
  nav?: number;
  [extra: string]: number | undefined;
}

export type MarketTickMap = Partial<Record<FundSymbol, MarketTick>>;

/** One data point on a (% return) trend chart after normalization. */
export interface ReturnSeriesPoint {
  datapg: string;
  value: number;
}

/** Aggregated return summary for a single fund (used for "bazdehi" cards). */
export interface FundReturnSummary {
  fund: FundSymbol;
  lastValue: number;
  percentageChange: number;
}
