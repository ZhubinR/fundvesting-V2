"use client";

import { useEffect, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GridLoader, MoonLoader, PropagateLoader } from "react-spinners";
import { ChartContainer, ChartTooltip } from "@/shared/ui/chart";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { toPersianDigits } from "@/shared/lib/persian-digits";
import { formatIsoDateAsJalali } from "@/shared/lib/jalali";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { EMPTY_FUND_RESULT, useFundCategorySeries } from "@/features/funds/api/funds-queries";
import { FUND_NAME_MAP, METRIC_SNAPSHOT_LABEL } from "@/features/funds/constants";
import { FundChartControls } from "@/features/funds/components/FundChartControls";
import { FundQuoteGrid, type FundQuoteOption } from "@/features/funds/components/FundQuoteGrid";
import { MetricTooltip } from "@/features/funds/components/MetricTooltip";
import { formatYAxisTick } from "@/features/funds/lib/format";
import type { FundDataPoint, FundMetricKey, FundSymbol } from "@/features/funds/types";
import { useCompareChartData } from "../hooks/use-compare-chart-data";
import { useCompareState } from "../hooks/use-compare-state";

const SERIES_1_COLOR = "#FF7B01";
const SERIES_2_COLOR = "#3C91E6";

export function ComparePage() {
  const {
    state,
    selectCategory,
    setMetric,
    setTimeFrame,
    setDateRange,
    selectFund,
    ensureDefaultFunds,
  } = useCompareState();

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

  // Picks an initial pair of funds the first time data for the current
  // category arrives, mirroring the original's "first and third fund"
  // default — but derived from the *unique fund list*, not raw array
  // indices into the flat (multi-date) series. The original did
  // `ahromMainData[0].fund` / `ahromMainData[2].fund` directly on the
  // flat per-date array, so the "3rd item" was really just the 3rd row
  // of whichever fund's data happened to load first — fragile, and
  // occasionally wrong (`goldMainData[2] ? ... : goldMainData[2].fund`
  // — both branches read index 2).
  useEffect(() => {
    if (seriesData.length === 0) return;
    const uniqueFunds = Array.from(new Set(seriesData.map((point) => point.fund)));
    const first = uniqueFunds[0];
    const second = uniqueFunds[2] ?? uniqueFunds[1];
    if (first && second) ensureDefaultFunds(first, second);
  }, [seriesData, ensureDefaultFunds]);

  const fundOptions = useMemo<FundQuoteOption[]>(() => {
    const latestByFund = new Map<FundSymbol, FundDataPoint>();
    for (const point of seriesData) latestByFund.set(point.fund, point);
    return Array.from(latestByFund.entries()).map(([symbol, point]) => ({
      symbol,
      fallbackPrice: point.fin_pr ?? null,
    }));
  }, [seriesData]);

  const { chartData, yAxisDomain, isReturnMetric, summary1, summary2, mean1, mean2 } =
    useCompareChartData(seriesData, state.fund1, state.fund2, state.metric);

  const hasChart = chartData.length > 0;
  const fund1Name = state.fund1 ? FUND_NAME_MAP[state.fund1] ?? state.fund1 : "";
  const fund2Name = state.fund2 ? FUND_NAME_MAP[state.fund2] ?? state.fund2 : "";

  return (
    <section className="flex items-center justify-center flex-col gap-5">
      {isDemo && <DemoDataNotice className="w-full" />}
      <div className="flex gap-3 p-3 bg-mid dark:bg-darkBackground-100 shadow-md rounded-2xl lg:w-1/3 w-full">
        <button
          type="button"
          className={`bg-background-500 rounded-lg text-background-300 w-full px-[14px] py-[6px] ${
            state.category === "ahrom" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
          }`}
          onClick={() => selectCategory("ahrom")}
        >
          صندوق اهرمی
        </button>
        <button
          type="button"
          className={`bg-background-500 rounded-lg text-background-300 w-full px-[14px] py-[6px] ${
            state.category === "gold" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
          }`}
          onClick={() => selectCategory("gold")}
        >
          صندوق طلا
        </button>
      </div>

      {hasChart ? (
        <div className="w-full flex lg:flex-row flex-col lg:gap-8 gap-0">
          <FundQuoteGrid
            title="صندوق اول را انتخاب کنید"
            funds={fundOptions}
            activeFund={state.fund1}
            onSelect={(fund) => selectFund(1, fund)}
          />
          <FundQuoteGrid
            title="صندوق دوم را انتخاب کنید"
            funds={fundOptions}
            activeFund={state.fund2}
            onSelect={(fund) => selectFund(2, fund)}
          />
        </div>
      ) : (
        <div className="w-full flex lg:flex-row flex-col lg:gap-8 gap-0">
          <div className="shadow-lg rounded-2xl lg:w-1/2 w-full bg-mid dark:bg-white p-4 mb-5 flex items-center justify-center min-h-[300px]">
            <GridLoader color="#51537B" />
          </div>
          <div className="shadow-lg rounded-2xl lg:w-1/2 w-full bg-mid dark:bg-white p-4 mb-5 flex items-center justify-center min-h-[300px]">
            <GridLoader color="#51537B" />
          </div>
        </div>
      )}

      <div className="flex lg:flex-row flex-col lg:gap-5 gap-0 w-full">
        <div className="lg:w-3/4 w-full rounded-2xl py-5 bg-mid dark:bg-[#eeeeee] shadow-lg mb-5 lg:mb-0">
          {hasChart ? (
            <>
              <p className="lg:hidden text-background-100 dark:text-neutral-600 font-light text-center text-sm mb-4">
                شما میتوانید نمودار را اسکرول کنید
              </p>
              <div className="overflow-scroll md:overflow-visible">
                <ChartContainer
                  config={{
                    series1: { label: fund1Name, color: SERIES_1_COLOR },
                    series2: { label: fund2Name, color: SERIES_2_COLOR },
                  }}
                  className="lg:px-6 pb-5 px-1 h-[500px] w-full min-w-[850px]"
                >
                  <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                    <defs>
                      <linearGradient id="colorSeries1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={SERIES_1_COLOR} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={SERIES_1_COLOR} stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorSeries2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={SERIES_2_COLOR} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={SERIES_2_COLOR} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<MetricTooltip metric={state.metric} />} />
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="datapg"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => formatIsoDateAsJalali(value)}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => formatYAxisTick(value, state.metric)}
                      domain={yAxisDomain}
                      allowDataOverflow={false}
                    />
                    <ReferenceLine y={0} stroke="#3D3E5C" />
                    <ChartTooltip />
                    <Legend />
                    <Area
                      dataKey="series1"
                      type="linear"
                      fill="url(#colorSeries1)"
                      stroke={SERIES_1_COLOR}
                      strokeWidth={2}
                      name={fund1Name}
                    />
                    <Area
                      dataKey="series2"
                      type="linear"
                      fill="url(#colorSeries2)"
                      stroke={SERIES_2_COLOR}
                      strokeWidth={2}
                      name={fund2Name}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </>
          ) : (
            <div className="bg-[#1f203485] dark:bg-white rounded-2xl w-full h-[500px] flex items-center justify-center">
              <MoonLoader color="#51537B" />
            </div>
          )}
        </div>

        {hasChart ? (
          <div className="lg:w-1/4 w-full flex flex-row lg:flex-col gap-4 mb-5 lg:min-h-full">
            <StatCard
              label={
                isReturnMetric
                  ? `${METRIC_SNAPSHOT_LABEL[state.metric]} ${fund1Name}`
                  : `میانگین ${METRIC_SNAPSHOT_LABEL[state.metric]} ${fund1Name}`
              }
              percentageChange={summary1?.percentageChange ?? null}
              mean={mean1}
              isReturnMetric={isReturnMetric}
              colorClassName="text-secondary-500"
            />
            <StatCard
              label={
                isReturnMetric
                  ? `${METRIC_SNAPSHOT_LABEL[state.metric]} ${fund2Name}`
                  : `میانگین ${METRIC_SNAPSHOT_LABEL[state.metric]} ${fund2Name}`
              }
              percentageChange={summary2?.percentageChange ?? null}
              mean={mean2}
              isReturnMetric={isReturnMetric}
              colorClassName="text-primary-500"
            />
          </div>
        ) : (
          <div className="lg:w-1/4 w-full flex flex-row lg:flex-col gap-4 mb-5 lg:min-h-full">
            <div className="bg-mid dark:bg-white shadow-lg rounded-2xl flex flex-col gap-5 items-center justify-center py-5 px-4 lg:h-1/2 w-full min-h-[150px]">
              <PropagateLoader color="#51537B" />
            </div>
            <div className="bg-mid dark:bg-white shadow-lg rounded-2xl flex flex-col gap-5 items-center justify-center py-5 px-4 lg:h-1/2 w-full min-h-[150px]">
              <PropagateLoader color="#51537B" />
            </div>
          </div>
        )}
      </div>

      <FundChartControls
        category={state.category}
        metric={state.metric}
        onMetricChange={setMetric}
        timeFrame={state.timeFrame}
        onTimeFrameChange={setTimeFrame}
        onDateRangeChange={setDateRange}
        labelStyle="snapshot"
      />
    </section>
  );
}

/**
 * The original showed `` `${convertToFarsiDigits(bazdehi1)}%` || <Loader/> ``
 * — a template string is always truthy (even `"undefined%"`), so that
 * loader fallback could never actually appear; while data was loading it
 * rendered the literal text "undefined%". This checks for a real value
 * instead of relying on JS truthiness of a string.
 */
function StatCard({
  label,
  percentageChange,
  mean,
  isReturnMetric,
  colorClassName,
}: {
  label: string;
  percentageChange: number | null;
  mean: number | null;
  isReturnMetric: boolean;
  colorClassName: string;
}) {
  const value = isReturnMetric ? percentageChange : mean;
  const display = value === null ? null : isReturnMetric ? `${toPersianDigits(value)}%` : toPersianDigits(value);

  return (
    <div className="bg-mid dark:bg-[#eeeeee] shadow-lg rounded-2xl flex flex-col gap-5 items-center justify-center py-5 px-4 lg:h-1/2 w-full">
      <p className="text-background-200 dark:text-neutral-600 font-medium">{label}</p>
      <span className={`${colorClassName} md:text-[24px] text-[20px] font-semibold`}>
        {display ?? <PropagateLoader color="#51537B" />}
      </span>
    </div>
  );
}
