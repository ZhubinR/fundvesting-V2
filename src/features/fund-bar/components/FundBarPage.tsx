"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/shared/ui/chart";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { useResponsiveChartFontSize } from "@/shared/lib/use-responsive-chart-font-size";
import { EMPTY_FUND_RESULT, useFundCategorySeries } from "@/features/funds/api/funds-queries";
import { FUND_NAME_MAP, METRIC_SNAPSHOT_LABEL } from "@/features/funds/constants";
import { FundChartControls } from "@/features/funds/components/FundChartControls";
import { useFundFilters } from "@/features/funds/hooks/use-fund-filters";
import { MetricTooltip } from "@/features/funds/components/MetricTooltip";
import { aggregateLatestByFund, getRelativeStartDate } from "@/features/funds/lib/normalize";
import { calculateYAxisDomain, formatMetricValue, formatYAxisTick } from "@/features/funds/lib/format";
import type { FundMetricKey } from "@/features/funds/types";

const BAR_COLOR = "#3C91E6";

export function FundBarPage() {
  const { state, selectCategory, setMetric, setTimeFrame, setDateRange } = useFundFilters();
  const fontSize = useResponsiveChartFontSize();

  const metrics = useMemo<FundMetricKey[]>(
    () => Array.from(new Set<FundMetricKey>(["id", state.metric, "fin_pr"])),
    [state.metric],
  );

  const range = useDebouncedValue(
    useMemo(
      () => ({
        intervalDays: state.timeFrame ?? undefined,
        from: state.dateRange.from,
        to: state.dateRange.to,
      }),
      [state.timeFrame, state.dateRange],
    ),
    300,
  );

  const { data } = useFundCategorySeries(state.category, metrics, range);
  const { value: seriesData, isDemo } = data ?? EMPTY_FUND_RESULT;

  // Either anchor is the user's custom "from" date, or — for a preset
  // time frame — today minus that many days. Either way, only funds that
  // already have history back to the anchor date are shown, so a
  // newly-listed fund doesn't show a misleadingly huge "return since
  // inception" next to funds with a full year of history.
  const anchorDate = state.dateRange.from ?? (state.timeFrame ? getRelativeStartDate(state.timeFrame) : null);

  const chartData = useMemo(
    () => aggregateLatestByFund(seriesData, state.metric, anchorDate),
    [seriesData, state.metric, anchorDate],
  );

  const yAxisDomain = useMemo(() => calculateYAxisDomain(chartData, "value"), [chartData]);

  const heading = `${state.metric === "fin_pr" || state.metric === "nav" ? "" : "میانگین "}${
    METRIC_SNAPSHOT_LABEL[state.metric]
  } ${getTimeFrameHeadingSuffix(state)}`;

  return (
    <>
      {isDemo && <DemoDataNotice />}
      <section className="flex flex-col-reverse rounded-2xl items-center justify-center overflow-hidden min-h-[300px] lg:min-h-[520px] xl:min-h-[650px] mb-5 gap-5">
        <div className="flex rounded-2xl bg-background-800 dark:bg-darkBackground-100 w-full flex-col lg:gap-8 gap-0 shadow-lg">
          <div className="lg:py-9 px-9 py-4 flex items-center justify-center lg:justify-start gap-5">
            <span className="lg:text-3xl text-[24px] font-semibold text-white dark:text-darkBackground-500 flex gap-1">
              {heading}
            </span>
          </div>
          <p className="lg:hidden text-background-100 dark:text-neutral-600 font-light text-center text-sm mb-4">
            شما میتوانید نمودار را اسکرول کنید
          </p>
          <div className="overflow-x-scroll xxl:overflow-visible customScroll">
            <ChartContainer
              config={{ value: { label: METRIC_SNAPSHOT_LABEL[state.metric], color: BAR_COLOR } }}
              className="lg:px-6 px-1 pb-4 lg:pb-0 lg:h-[400px] h-[350px] w-full min-w-[1500px]"
            >
              <BarChart data={chartData} margin={{ left: 12, right: 12, top: 20, bottom: 20 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="fund"
                  tickFormatter={(fund) => FUND_NAME_MAP[fund as keyof typeof FUND_NAME_MAP] ?? fund}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: `${fontSize}px` }}
                  minTickGap={32}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: `${fontSize}px` }}
                  tickMargin={8}
                  tickFormatter={(value) => formatYAxisTick(value, state.metric)}
                  domain={yAxisDomain}
                />
                <ReferenceLine y={0} stroke="#3D3E5C" />
                <Tooltip
                  content={
                    <MetricTooltip
                      metric={state.metric}
                      formatLabel={(fund) => FUND_NAME_MAP[fund as keyof typeof FUND_NAME_MAP] ?? fund}
                      firstEntryColorClassName="text-primary-700"
                    />
                  }
                />
                <Bar dataKey="value" name={METRIC_SNAPSHOT_LABEL[state.metric]} fill={BAR_COLOR} radius={[20, 20, 0, 0]} barSize={45}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value: unknown) => {
                      const numericValue = Number(value);
                      return Number.isFinite(numericValue) ? formatMetricValue(numericValue, state.metric) : "";
                    }}
                    style={{ fill: "#000", fontSize }}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="bg-mid dark:bg-[#eeeeee] w-full md:w-[360px] rounded-lg flex-col md:flex-row shadow-md">
          <div className="gap-3 lg:p-3 p-2 flex flex-col lg:flex-row">
            <button
              type="button"
              className={`bg-background-500 rounded-lg text-background-300 lg:w-1/2 w-full px-[14px] py-[6px] ${
                state.category === "ahrom" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
              }`}
              onClick={() => selectCategory("ahrom")}
            >
              صندوق اهرمی
            </button>
            <button
              type="button"
              className={`bg-background-500 rounded-lg text-background-300 lg:w-1/2 w-full px-[14px] py-[6px] ${
                state.category === "gold" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
              }`}
              onClick={() => selectCategory("gold")}
            >
              صندوق طلا
            </button>
          </div>
        </div>
      </section>

      <FundChartControls
        category={state.category}
        metric={state.metric}
        onMetricChange={setMetric}
        timeFrame={state.timeFrame}
        onTimeFrameChange={setTimeFrame}
        onDateRangeChange={setDateRange}
        labelStyle="snapshot"
      />
    </>
  );
}

/**
 * The original checked `if (timeFrame && fromDate && toDate)` for the
 * "custom range selected" heading text — but selecting a custom range
 * always set `timeFrame` to `null` first, so that condition could never
 * be true and the heading silently went blank instead of saying
 * "بازه زمانی انتخابی". This checks the date range directly, so the
 * heading is correct in both modes.
 */
function getTimeFrameHeadingSuffix(state: { timeFrame: number | null; dateRange: { from: string | null; to: string | null } }): string {
  if (state.dateRange.from && state.dateRange.to) return "بازه زمانی انتخابی";
  switch (state.timeFrame) {
    case 31:
      return "ماهانه";
    case 91:
      return "سه ماهه";
    case 184:
      return "شش ماهه";
    case 366:
      return "سالانه";
    default:
      return "";
  }
}
