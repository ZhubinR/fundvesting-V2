"use client";

import { useState } from "react";
import { DateField } from "./DateField";
import { MetricSelect } from "./MetricSelect";
import { TimeFrameTabs } from "./TimeFrameTabs";
import type { FundCategory, FundMetricKey, TimeFrameDays } from "../types";

export interface DateRange {
  from: string | null;
  to: string | null;
}

/**
 * The time-frame / date-range / metric control bar shown above every fund
 * chart. One component now serves the compare, fund-bar, fund-trend and
 * home pages; the old code had two near-duplicate ~80-line components
 * (`ChartController`, `ChartcontrollerBar`) differing only in which
 * label dictionary they used, plus a `handleOptionChange` branch in
 * `ChartController` that referenced variables (`chartData`,
 * `setChartData`, `normalizeData`) that didn't exist anywhere in that
 * file's scope — dead code that would have thrown if it had ever run.
 */
export function FundChartControls({
  category,
  metric,
  onMetricChange,
  timeFrame,
  onTimeFrameChange,
  onDateRangeChange,
  labelStyle = "trend",
}: {
  category: FundCategory;
  metric: FundMetricKey;
  onMetricChange: (metric: FundMetricKey) => void;
  timeFrame: TimeFrameDays | null;
  onTimeFrameChange: (timeFrame: TimeFrameDays) => void;
  onDateRangeChange: (range: DateRange) => void;
  labelStyle?: "trend" | "snapshot";
}) {
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [pendingTo, setPendingTo] = useState<string | null>(null);

  const handleFromChange = (from: string | null) => {
    setPendingFrom(from);
    if (from && pendingTo) onDateRangeChange({ from, to: pendingTo });
  };

  const handleToChange = (to: string | null) => {
    setPendingTo(to);
    if (pendingFrom && to) onDateRangeChange({ from: pendingFrom, to });
  };

  // Picking a preset time frame and entering a custom date range used to
  // be able to disagree silently (the old code let you set a custom range,
  // then clicking a time-frame button did nothing because the date range
  // "won" inside fetchData with no visual feedback). Here, choosing a
  // preset always clears any in-progress custom range, so exactly one of
  // the two controls is ever in effect.
  const handleTimeFrameClick = (next: TimeFrameDays) => {
    setPendingFrom(null);
    setPendingTo(null);
    onTimeFrameChange(next);
  };

  return (
    <section className="flex w-full lg:flex-row flex-col gap-5 p-4 rounded-2xl bg-mid dark:bg-[#f1f1f1] shadow-md mb-5">
      <div className="lg:w-1/3">
        <p className="mb-1 text-[12px] font-medium text-background-300 dark:text-darkBackground-500">
          بازده زمانی
        </p>
        <TimeFrameTabs value={timeFrame} onChange={handleTimeFrameClick} />
      </div>
      <div className="lg:w-1/3">
        <p className="mb-1 text-[12px] font-medium text-background-300 dark:text-darkBackground-500">
          انتخاب زمان
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
          <DateField label="از" onDateChange={handleFromChange} />
          <DateField label="تا" onDateChange={handleToChange} />
        </div>
      </div>
      <div className="lg:w-1/3">
        <p className="mb-1 text-[12px] font-medium text-background-300 dark:text-darkBackground-500">
          متغیر ها
        </p>
        <div className="flex items-center gap-5 shadow-md bg-background-500 dark:bg-neutral-200 px-4 rounded-md">
          <MetricSelect value={metric} onChange={onMetricChange} category={category} labelStyle={labelStyle} />
        </div>
      </div>
    </section>
  );
}
