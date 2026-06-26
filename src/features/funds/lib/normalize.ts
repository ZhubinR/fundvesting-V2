import type {
  FundDataPoint,
  FundMetricKey,
  FundReturnSummary,
  FundSymbol,
  ReturnSeriesPoint,
  TimeFrameDays,
} from "../types";

const RETURN_METRICS: ReadonlySet<FundMetricKey> = new Set(["fin_pr", "nav"]);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Turns a single fund's raw time series into a cumulative-return series
 * (% change since the first valid data point), filling gaps in the data:
 *  - a missing value carries the last known value forward, or
 *  - if no prior value exists yet, linearly interpolates toward the next
 *    known value.
 *
 * Typed, behaviour-preserving port of `RavandHandler` from
 * `utils/RavandHandler.js`. The one intentional change: this returns a
 * `number`, not a `.toFixed(2)` string — formatting is a presentation
 * concern and now lives in `format.ts`, not mixed into the data.
 */
export function toCumulativeReturnSeries(
  points: readonly FundDataPoint[],
  metric: FundMetricKey,
): ReturnSeriesPoint[] {
  if (points.length === 0) return [];

  const firstValid = points.find((p) => p[metric] != null)?.[metric] ?? 0;
  const isReturnMetric = RETURN_METRICS.has(metric);

  let lastValid: number | null = null;

  return points.map((point, index) => {
    let current = point[metric] ?? null;

    if (current === null) {
      if (lastValid !== null) {
        current = lastValid;
      } else {
        const nextValidIndex = points.findIndex((p, i) => i > index && p[metric] != null);
        if (nextValidIndex !== -1) {
          const nextValid = points[nextValidIndex]?.[metric] ?? firstValid;
          const factor = index / nextValidIndex;
          current = firstValid + (nextValid - firstValid) * factor;
        } else {
          current = firstValid;
        }
      }
    }

    lastValid = current;

    if (!isReturnMetric) {
      return { datapg: point.datapg, value: current };
    }

    if (index === 0 || firstValid === 0) {
      return { datapg: point.datapg, value: 0 };
    }

    return { datapg: point.datapg, value: round2((current / firstValid - 1) * 100) };
  });
}

/**
 * Summarizes a single fund's series into a first-value/last-value percent
 * change (used for the "bazdehi" stat cards on the compare page).
 *
 * Typed port of `BazdehiHandle` from `utils/RavandHandler.js`, with one
 * bug fix: the original sorted by `item.date`, a field the API never
 * actually returns (every other call site uses `datapg`). `new
 * Date(undefined)` silently produced `Invalid Date`, so the sort was a
 * no-op in production — harmless only because the API already returns
 * rows in chronological order. This sorts by the real field.
 */
export function summarizeFundReturn(
  points: readonly FundDataPoint[],
  metric: FundMetricKey,
): FundReturnSummary | null {
  if (points.length === 0) return null;

  const sorted = [...points].sort(
    (a, b) => new Date(a.datapg).getTime() - new Date(b.datapg).getTime(),
  );

  const firstFund = sorted[0]?.fund;
  if (!firstFund) return null;

  const firstValue = sorted.find((p) => p[metric] != null)?.[metric] ?? 0;

  let lastValue: number | null = null;
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const candidate = sorted[i]?.[metric];
    if (candidate != null) {
      lastValue = candidate;
      break;
    }
  }
  if (lastValue === null) return null;

  const percentageChange = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;

  return {
    fund: firstFund,
    lastValue,
    percentageChange: round2(percentageChange),
  };
}

export interface FundAggregatePoint {
  fund: FundSymbol;
  value: number | null;
}

/**
 * Reduces a multi-fund, multi-date series down to one value per fund:
 * a percent return (first -> last) for `fin_pr`/`nav`, or a plain average
 * for every other metric. Optionally restricted to funds that have a data
 * point on `anchorDate` (used by the fund-bar page's "from date" filter).
 *
 * Typed port of the ~80-line `normalizeData` function that was defined
 * *inline inside the fundBar page component* in the old code.
 */
export function aggregateLatestByFund(
  points: readonly FundDataPoint[],
  metric: FundMetricKey,
  anchorDate?: string | null,
): FundAggregatePoint[] {
  type Bucket = { fund: FundSymbol; values: { date: string; value: number }[] };
  const byFund = new Map<FundSymbol, Bucket>();

  for (const point of points) {
    const raw = point[metric] ?? null;
    // Holidays carry no trade value at all for tr_val; skip rather than
    // letting them drag the average toward zero.
    if (metric === "tr_val" && raw === null) continue;

    const bucket = byFund.get(point.fund) ?? { fund: point.fund, values: [] };
    if (raw !== null) bucket.values.push({ date: point.datapg, value: raw });
    byFund.set(point.fund, bucket);
  }

  const anchorKey = anchorDate ? anchorDate.replaceAll("/", "-") : null;

  let aggregated: FundAggregatePoint[] = Array.from(byFund.values())
    .filter((bucket) => !anchorKey || bucket.values.some((v) => v.date === anchorKey))
    .map((bucket) => ({ fund: bucket.fund, value: aggregateBucket(bucket.values, metric) }));

  // If the anchor date filtered out every fund, fall back to showing all
  // funds (with no value) rather than an empty chart.
  if (aggregated.length === 0 && anchorKey) {
    aggregated = Array.from(byFund.values()).map((bucket) => ({ fund: bucket.fund, value: null }));
  }

  return aggregated.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

function aggregateBucket(
  values: { date: string; value: number }[],
  metric: FundMetricKey,
): number | null {
  if (values.length === 0) return null;

  if (RETURN_METRICS.has(metric)) {
    const sorted = [...values].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0]?.value;
    const last = sorted[sorted.length - 1]?.value;
    if (first === undefined || last === undefined) return null;
    if (first === 0) return 0;
    return round2(((last - first) / first) * 100);
  }

  const total = values.reduce((sum, v) => sum + v.value, 0);
  return round2(total / values.length);
}

/**
 * `31 | 91 | 184 | 366` days -> the ISO start date that many days back
 * from today. Typed port of `getStartDate` from `barChartCalculatuins.js`,
 * using native `Date` math instead of moment.js (one of four overlapping
 * date libraries in the old `package.json` — date-fns, date-fns-jalali,
 * dayjs and moment were all installed; only jalaali-js is actually needed,
 * for Jalali calendar conversion).
 */
export function getRelativeStartDate(timeFrame: TimeFrameDays): string {
  const date = new Date();
  switch (timeFrame) {
    case 31:
      date.setMonth(date.getMonth() - 1);
      break;
    case 91:
      date.setDate(date.getDate() - 91);
      break;
    case 184:
      date.setMonth(date.getMonth() - 6);
      break;
    case 366:
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      break;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Keeps only funds that have at least one data point on `date`. */
export function filterFundsWithDataOnDate(
  points: readonly FundDataPoint[],
  date: string,
): FundDataPoint[] {
  const matchingFunds = new Set<FundSymbol>();
  for (const point of points) {
    if (point.datapg === date) matchingFunds.add(point.fund);
  }
  return points.filter((point) => matchingFunds.has(point.fund));
}
