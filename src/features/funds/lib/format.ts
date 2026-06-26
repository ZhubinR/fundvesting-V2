import { toPersianDigits } from "@/shared/lib/persian-digits";
import type { FundMetricKey } from "../types";

const PERCENT_METRICS: ReadonlySet<FundMetricKey> = new Set(["fin_bub", "st_wg", "fin_pr", "nav"]);
const CURRENCY_METRICS: ReadonlySet<FundMetricKey> = new Set(["tr_val", "net_wass"]);

function toFaNumber(value: number, fractionDigits: number): string {
  return value.toLocaleString("fa-IR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Formats a raw metric value for display (tooltips, axis ticks, summary
 * cards). This single function replaces the same `if/else` chain that was
 * duplicated, nearly verbatim, in every chart component:
 *  - percent metrics (`fin_bub`, `st_wg`, `fin_pr`, `nav`) -> `"12.34%"`
 *  - `rl_levrat` -> divided by 100, no suffix (matches the original;
 *    `cl_levrat` is already on the right scale)
 *  - `cl_levrat` -> as-is, no suffix
 *  - `tr_val` / `net_wass` -> divided by 1e10, suffixed `"B"`
 *  - anything else -> the raw number, Persian digits
 */
export function formatMetricValue(value: number, metric: FundMetricKey): string {
  if (PERCENT_METRICS.has(metric)) {
    return `${toFaNumber(value, 2)}%`;
  }
  if (metric === "rl_levrat") {
    return toFaNumber(value / 100, 2);
  }
  if (metric === "cl_levrat") {
    return toFaNumber(value, 2);
  }
  if (CURRENCY_METRICS.has(metric)) {
    return `${toFaNumber(value / 10_000_000_000, 0)}B`;
  }
  return toPersianDigits(value);
}

/** Recharts Y-axis tick formatter; empty string for non-finite input. */
export function formatYAxisTick(value: unknown, metric: FundMetricKey): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  return formatMetricValue(value, metric);
}

/**
 * Computes a padded `[min, max]` domain for a Y axis from a series of
 * chart-ready points. Typed port of `calculateYAxisDomain`
 * (chartUtils.js), with one bug fix: the original didn't filter out
 * `NaN`/missing values before calling `Math.min`/`Math.max`, so a single
 * gap in the data silently broke the whole axis (`Math.min` of any array
 * containing `NaN` is `NaN`). This filters first.
 */
export function calculateYAxisDomain<T extends object>(
  data: readonly T[],
  keys: string | readonly string[],
): ["auto", "auto"] | [number, number] {
  const keyList = Array.isArray(keys) ? keys : [keys];
  const values = data
    .flatMap((item) => keyList.map((key) => Number((item as Record<string, unknown>)[key])))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return ["auto", "auto"];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;

  return [Math.floor(min - padding), Math.ceil(max + padding)];
}
