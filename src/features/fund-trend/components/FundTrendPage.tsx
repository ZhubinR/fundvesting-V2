"use client";

import { useEffect, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { GridLoader, MoonLoader } from "react-spinners";
import { ChartContainer, ChartTooltip } from "@/shared/ui/chart";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { formatIsoDateAsJalali } from "@/shared/lib/jalali";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { useResponsiveChartFontSize } from "@/shared/lib/use-responsive-chart-font-size";
import { EMPTY_FUND_RESULT, useFundCategorySeries } from "@/features/funds/api/funds-queries";
import { FUND_NAME_MAP, METRIC_TREND_LABEL } from "@/features/funds/constants";
import { FundChartControls } from "@/features/funds/components/FundChartControls";
import { FundQuoteCard } from "@/features/funds/components/FundQuoteCard";
import { MetricTooltip } from "@/features/funds/components/MetricTooltip";
import { toCumulativeReturnSeries } from "@/features/funds/lib/normalize";
import { calculateYAxisDomain, formatYAxisTick } from "@/features/funds/lib/format";
import type { FundDataPoint, FundMetricKey, FundSymbol } from "@/features/funds/types";
import { useFundTrendState } from "../hooks/use-fund-trend-state";

const LINE_COLOR = "#3C91E6";

export function FundTrendPage() {
  const { state, selectCategory, setMetric, setTimeFrame, setDateRange, selectFund, ensureDefaultFund } =
    useFundTrendState();
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

  useEffect(() => {
    const firstFund = seriesData[0]?.fund;
    if (firstFund) ensureDefaultFund(firstFund);
  }, [seriesData, ensureDefaultFund]);

  const fundOptions = useMemo(() => {
    const latestByFund = new Map<FundSymbol, FundDataPoint>();
    for (const point of seriesData) latestByFund.set(point.fund, point);
    return Array.from(latestByFund.entries()).map(([symbol, point]) => ({
      symbol,
      fallbackPrice: point.fin_pr ?? null,
    }));
  }, [seriesData]);

  const fundSeries = useMemo(
    () => seriesData.filter((point) => point.fund === state.fund),
    [seriesData, state.fund],
  );

  const chartData = useMemo(() => toCumulativeReturnSeries(fundSeries, state.metric), [fundSeries, state.metric]);
  const yAxisDomain = useMemo(() => calculateYAxisDomain(chartData, "value"), [chartData]);

  const hasChart = chartData.length > 0;
  const fundName = state.fund ? FUND_NAME_MAP[state.fund] ?? state.fund : "";

  return (
    <>
      {isDemo && <DemoDataNotice />}
      <section className="flex bg-background-800 dark:bg-darkBackground-100 lg:flex-row flex-col-reverse rounded-2xl overflow-hidden min-h-[300px] lg:min-h-[520px] xl:min-h-[650px] mb-5 md:shadow-lg shadow-lg">
        <div className="lg:w-3/4 flex w-full flex-col lg:gap-8 gap-0">
          {hasChart ? (
            <>
              <div className="lg:py-9 px-9 py-4 flex flex-col items-center lg:items-start justify-center lg:justify-start gap-3 lg:gap-4">
                <span className="lg:text-[20px] text-[14px] font-medium text-background-400 dark:text-background-600">
                  {getTimeFrameLabel(state)}
                </span>
                <span className="lg:text-3xl text-[24px] font-semibold text-white dark:text-neutral-700 flex gap-1">
                  {METRIC_TREND_LABEL[state.metric]}
                  <span className="text-primary-400">{fundName}</span>
                </span>
              </div>
              <p className="lg:hidden text-background-100 dark:text-neutral-600 font-light text-center text-sm mb-4">
                شما میتوانید نمودار را اسکرول کنید
              </p>
              <div className="overflow-scroll md:overflow-visible">
                <ChartContainer
                  config={{ value: { label: fundName, color: LINE_COLOR } }}
                  className="lg:px-6 px-1 pb-4 lg:pb-0 lg:h-[400px] h-[350px] w-full min-w-[700px]"
                >
                  <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                    <defs>
                      <linearGradient id="colorFinPr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<MetricTooltip metric={state.metric} firstEntryColorClassName="text-primary-700" />} />
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="datapg"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => formatIsoDateAsJalali(value)}
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
                    <ChartTooltip />
                    <Area dataKey="value" type="linear" fill="url(#colorFinPr)" stroke={LINE_COLOR} strokeWidth={2} name={fundName} />
                  </AreaChart>
                </ChartContainer>
              </div>
            </>
          ) : (
            <div className="bg-[#1f203485] dark:bg-white rounded-2xl w-full h-full flex items-center justify-center">
              <MoonLoader color="#51537B" />
            </div>
          )}
        </div>

        <div className="lg:bg-mid bg-mid dark:bg-[#eeeeee] shadow-inner w-full lg:w-1/4 border-b-2 border-background-700 dark:border-background-100 lg:border-0">
          {hasChart ? (
            <>
              <div className="gap-3 lg:p-3 p-2 shadow-inner border-b border-background-700 dark:border-background-100 flex flex-col lg:flex-row">
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
              <div className="p-3 overflow-y-scroll flex flex-col gap-[10px] max-h-[200px] lg:max-h-[520px] xl:max-h-[650px] customScroll">
                {fundOptions.map(({ symbol, fallbackPrice }) => (
                  <FundQuoteCard
                    key={symbol}
                    symbol={symbol}
                    fallbackPrice={fallbackPrice}
                    isActive={state.fund === symbol}
                    onSelect={() => selectFund(symbol)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-[#1f203485] dark:bg-white rounded-2xl w-full h-full flex items-center justify-center">
              <GridLoader color="#51537B" />
            </div>
          )}
        </div>
      </section>

      <FundChartControls
        category={state.category}
        metric={state.metric}
        onMetricChange={setMetric}
        timeFrame={state.timeFrame}
        onTimeFrameChange={setTimeFrame}
        onDateRangeChange={setDateRange}
        labelStyle="trend"
      />
    </>
  );
}

/**
 * Same fix as the fund-bar page: a custom date range always nulls out
 * `timeFrame`, so the original's `if (timeFrame && fromDate && toDate)`
 * check could never be true and the custom-range label never appeared.
 */
function getTimeFrameLabel(state: {
  timeFrame: number | null;
  dateRange: { from: string | null; to: string | null };
}): string {
  if (state.dateRange.from && state.dateRange.to) return "بازه زمانی انتخابی";
  switch (state.timeFrame) {
    case 31:
      return "بازه ماهانه";
    case 91:
      return "بازه سه ماهه";
    case 184:
      return "بازه شش ماهه";
    case 366:
      return "بازه سالانه";
    default:
      return "";
  }
}
