"use client";

import { useMemo } from "react";
import { calculateYAxisDomain } from "@/features/funds/lib/format";
import { summarizeFundReturn, toCumulativeReturnSeries } from "@/features/funds/lib/normalize";
import type { FundDataPoint, FundMetricKey, FundReturnSummary, FundSymbol } from "@/features/funds/types";

export interface ComparePoint {
  datapg: string;
  series1?: number;
  series2?: number;
}

/**
 * Builds the merged two-series chart data, Y-axis domain, and the
 * "bazdehi"/mean stat-card values, all as pure derivations of
 * (series data, the two selected funds, the selected metric).
 *
 * The original component computed every one of these in its own
 * `useState` + `useEffect` pair — `chartData`/`setChartData`,
 * `mean1`/`setMean1`, `mean2`/`setMean2`, `bazdehi1`/`setBazdehi1`,
 * `bazdehi2`/`setBazdehi2` — even though none of them needed to be state
 * at all; they're 100% computable from props that were already in scope.
 * `useMemo` here means there's no extra render, no stale-state window,
 * and no dependency-array bug to get wrong.
 */
export function useCompareChartData(
  seriesData: readonly FundDataPoint[],
  fund1: FundSymbol | null,
  fund2: FundSymbol | null,
  metric: FundMetricKey,
) {
  const data1 = useMemo(() => seriesData.filter((p) => p.fund === fund1), [seriesData, fund1]);
  const data2 = useMemo(() => seriesData.filter((p) => p.fund === fund2), [seriesData, fund2]);

  const chartData = useMemo<ComparePoint[]>(() => {
    const normalized1 = toCumulativeReturnSeries(data1, metric);
    const normalized2 = toCumulativeReturnSeries(data2, metric);

    const byDate = new Map<string, ComparePoint>();
    for (const point of normalized1) {
      byDate.set(point.datapg, { datapg: point.datapg, series1: point.value });
    }
    for (const point of normalized2) {
      const existing = byDate.get(point.datapg);
      if (existing) existing.series2 = point.value;
      else byDate.set(point.datapg, { datapg: point.datapg, series2: point.value });
    }

    return Array.from(byDate.values()).sort(
      (a, b) => new Date(a.datapg).getTime() - new Date(b.datapg).getTime(),
    );
  }, [data1, data2, metric]);

  const yAxisDomain = useMemo(
    () => calculateYAxisDomain(chartData, ["series1", "series2"]),
    [chartData],
  );

  const isReturnMetric = metric === "fin_pr" || metric === "nav";

  const summary1 = useMemo<FundReturnSummary | null>(
    () => (isReturnMetric ? summarizeFundReturn(data1, metric) : null),
    [data1, metric, isReturnMetric],
  );
  const summary2 = useMemo<FundReturnSummary | null>(
    () => (isReturnMetric ? summarizeFundReturn(data2, metric) : null),
    [data2, metric, isReturnMetric],
  );

  const mean1 = useMemo(
    () => (isReturnMetric ? null : average(chartData.map((p) => p.series1))),
    [chartData, isReturnMetric],
  );
  const mean2 = useMemo(
    () => (isReturnMetric ? null : average(chartData.map((p) => p.series2))),
    [chartData, isReturnMetric],
  );

  return { chartData, yAxisDomain, isReturnMetric, summary1, summary2, mean1, mean2 };
}

function average(values: (number | undefined)[]): number | null {
  const valid = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((sum, v) => sum + v, 0) / valid.length) * 100) / 100;
}
