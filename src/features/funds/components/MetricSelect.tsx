"use client";

import { METRIC_SNAPSHOT_LABEL, METRIC_TREND_LABEL } from "../constants";
import type { FundCategory, FundMetricKey } from "../types";

const AHROM_ONLY_METRICS: FundMetricKey[] = ["st_wg", "rl_levrat", "cl_levrat"];
const BASE_METRICS: FundMetricKey[] = ["fin_pr", "nav", "tr_val", "fin_bub", "net_wass"];

export function MetricSelect({
  value,
  onChange,
  category,
  labelStyle = "trend",
}: {
  value: FundMetricKey;
  onChange: (metric: FundMetricKey) => void;
  category: FundCategory;
  /** "trend" labels describe a series over time; "snapshot" labels describe one value. */
  labelStyle?: "trend" | "snapshot";
}) {
  const labels = labelStyle === "trend" ? METRIC_TREND_LABEL : METRIC_SNAPSHOT_LABEL;
  const metrics = category === "ahrom" ? [...BASE_METRICS, ...AHROM_ONLY_METRICS] : BASE_METRICS;

  return (
    <select
      name="metric"
      className="cursor-pointer w-full h-14 text-right bg-background-500 dark:bg-neutral-200 px-4 text-white dark:text-neutral-500 font-normal focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value as FundMetricKey)}
    >
      {metrics.map((metric) => (
        <option key={metric} value={metric}>
          {labels[metric]}
        </option>
      ))}
    </select>
  );
}
