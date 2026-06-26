"use client";

import { formatIsoDateAsJalali } from "@/shared/lib/jalali";
import { formatMetricValue } from "../lib/format";
import type { FundMetricKey } from "../types";

interface TooltipPayloadEntry {
  name?: string;
  value?: number | string;
  dataKey?: string | number;
}

export function MetricTooltip({
  active,
  payload,
  label,
  metric,
  formatLabel = formatIsoDateAsJalali,
  firstEntryColorClassName = "text-secondary-600",
  restEntryColorClassName = "text-primary-600",
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  metric: FundMetricKey;
  /** Trend charts (one point per date) format the label as a Jalali date by
   * default; snapshot/bar charts (one point per fund) pass a fund-name
   * formatter instead. */
  formatLabel?: (label: string) => string;
  firstEntryColorClassName?: string;
  restEntryColorClassName?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background-100 border border-background-400 rounded p-2 shadow-sm">
      <p className="text-sm text-background-500 font-medium">{label ? formatLabel(label) : null}</p>
      {payload.map((entry, index) => {
        const numericValue = Number(entry.value);
        const displayValue = Number.isFinite(numericValue)
          ? formatMetricValue(numericValue, metric)
          : entry.value;

        return (
          <p
            key={entry.dataKey ?? index}
            className={`text-sm font-semibold ${index === 0 ? firstEntryColorClassName : restEntryColorClassName}`}
          >
            {entry.name}: {displayValue}
          </p>
        );
      })}
    </div>
  );
}
