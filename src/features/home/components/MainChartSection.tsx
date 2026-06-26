"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { MoonLoader } from "react-spinners";
import { ChartContainer, ChartTooltip } from "@/shared/ui/chart";
import { formatIsoDateAsJalali } from "@/shared/lib/jalali";
import { FUND_NAME_MAP } from "@/features/funds/constants";
import { FundQuoteCard } from "@/features/funds/components/FundQuoteCard";
import { MetricTooltip } from "@/features/funds/components/MetricTooltip";
import { toCumulativeReturnSeries } from "@/features/funds/lib/normalize";
import { calculateYAxisDomain, formatYAxisTick } from "@/features/funds/lib/format";
import { useMarketTick } from "@/shared/websocket/use-market-socket";
import type { FundCategory, FundDataPoint, FundSymbol } from "@/features/funds/types";

const LINE_COLOR = "#3C91E6";

export function MainChartSection({
  ahromData,
  goldData,
}: {
  ahromData: readonly FundDataPoint[];
  goldData: readonly FundDataPoint[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState<FundCategory>("ahrom");
  const [selectedFund, setSelectedFund] = useState<FundSymbol | null>(null);

  const seriesData = category === "ahrom" ? ahromData : goldData;

  const fundOptions = useMemo(() => {
    const latestByFund = new Map<FundSymbol, FundDataPoint>();
    for (const point of seriesData) latestByFund.set(point.fund, point);
    return Array.from(latestByFund.entries()).map(([symbol, point]) => ({
      symbol,
      fallbackPrice: point.fin_pr ?? null,
    }));
  }, [seriesData]);

  const activeFund = selectedFund ?? fundOptions[0]?.symbol ?? null;

  const fundSeries = useMemo(() => seriesData.filter((p) => p.fund === activeFund), [seriesData, activeFund]);
  const chartData = useMemo(() => toCumulativeReturnSeries(fundSeries, "fin_pr"), [fundSeries]);
  const yAxisDomain = useMemo(() => calculateYAxisDomain(chartData, "value"), [chartData]);

  const lastFinPr = fundSeries.at(-1)?.fin_pr ?? 0;
  const liveTick = useMarketTick(activeFund as FundSymbol);
  const displayPrice = liveTick?.last_pr ?? lastFinPr;

  const fundName = activeFund ? FUND_NAME_MAP[activeFund] ?? activeFund : "";
  const hasChart = chartData.length > 0;

  const handleSelectCategory = (next: FundCategory) => {
    setCategory(next);
    setSelectedFund(null);
  };

  const handleViewTrend = () => {
    if (!activeFund) return;
    const params = new URLSearchParams({ tab: category, myfund: activeFund, timeFrame: "31" });
    router.push(`/fundRavand?${params.toString()}`);
  };

  return (
    <section className="flex bg-background-800 dark:bg-darkBackground-100 lg:flex-row flex-col-reverse rounded-2xl shadow-2xl overflow-hidden min-h-[300px] lg:min-h-[520px] xl:min-h-[650px] mb-5">
      <div className="lg:w-3/4 flex flex-col w-full gap-8">
        <div className="lg:p-9 p-5 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col gap-4">
            <span className="lg:text-[20px] text-[14px] font-light text-primary-300 dark:text-primary-500 text-center md:text-right mb-1 md:mb-0">
              روند بازدهی ماهانه نماد
              <span className="text-secondary-500 mr-[6px]">{fundName}</span>
            </span>
            <span className="text-2xl flex-col lg:flex-row items-center md:items-start lg:items-center font-medium lg:font-semibold text-white dark:text-neutral-700 flex gap-1 text-center md:text-right">
              <span>
                قیمت آخرین معامله <span className="text-primary-400">{fundName}</span>:{" "}
              </span>
              <span className="mb-3 lg:mb-0 text-background-300 dark:text-secondary-500 text-2xl">
                {displayPrice.toLocaleString("fa-IR")} <span className="text-sm">ریال</span>
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleViewTrend}
            className="bg-secondary-500 rounded-md text-white lg:px-[16px] px-[10px] text-center lg:py-[8px] py-[5px] lg:text-[16px] text-[14px] font-medium w-full md:w-fit"
          >
            صفحه روند صندوق
          </button>
        </div>
        <p className="lg:hidden text-background-100 font-light text-center text-sm">
          شما میتوانید نمودار را اسکرول کنید
        </p>
        {hasChart ? (
          <div className="overflow-scroll md:overflow-visible">
            <ChartContainer
              config={{ value: { label: fundName, color: LINE_COLOR } }}
              className="lg:px-6 px-2 pb-4 lg:pb-0 lg:h-[400px] h-[350px] w-full min-w-[700px]"
            >
              <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient id="colorFinPr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip content={<MetricTooltip metric="fin_pr" firstEntryColorClassName="text-primary-700" />} />
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="datapg"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  scale="auto"
                  padding={{ left: 10, right: 10 }}
                  minTickGap={32}
                  tickFormatter={(value) => formatIsoDateAsJalali(value)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatYAxisTick(value, "fin_pr")}
                  domain={yAxisDomain}
                />
                <ReferenceLine y={0} stroke="#3d3e5c50" />
                <ChartTooltip />
                <Area dataKey="value" type="linear" fill="url(#colorFinPr)" stroke={LINE_COLOR} strokeWidth={2} name={fundName} />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="bg-[#1f203485] rounded-2xl w-full h-full flex items-center justify-center">
            <MoonLoader color="#51537B" />
          </div>
        )}
      </div>

      <div className="bg-mid dark:bg-[#f1f1f1] w-full shadow-inner lg:w-1/4 border-b-2 lg:border-0">
        <div className="lg:p-3 p-2 border-b border-background-700 dark:border-background-100 flex flex-col">
          <span className="text-background-400 dark:text-background-600 text-[12px] font-light">محبوب ترین ها</span>
          <p className="text-white dark:text-neutral-700 font-semibold lg:text-[16px] text-sm">روند بازدهی ماهانه نماد</p>
        </div>
        <div className="flex flex-row gap-3 lg:p-3 p-2 border-b border-b-background-700 dark:border-background-100">
          <button
            type="button"
            className={`bg-background-500 rounded-lg text-background-300 lg:w-1/2 w-full text-sm px-[10px] py-[6px] ${
              category === "ahrom" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
            }`}
            onClick={() => handleSelectCategory("ahrom")}
          >
            صندوق اهرمی
          </button>
          <button
            type="button"
            className={`bg-background-500 rounded-lg text-background-300 lg:w-1/2 w-full text-sm px-[10px] py-[6px] ${
              category === "gold" ? "bg-primary-500 dark:bg-secondary-500 text-white" : "dark:bg-white"
            }`}
            onClick={() => handleSelectCategory("gold")}
          >
            صندوق طلا
          </button>
        </div>
        <div className="p-3 overflow-y-scroll flex flex-col gap-[10px] h-[200px] lg:h-[480px] xl:h-[500px] customScroll">
          {fundOptions.map(({ symbol, fallbackPrice }) => (
            <FundQuoteCard
              key={symbol}
              symbol={symbol}
              fallbackPrice={fallbackPrice}
              isActive={activeFund === symbol}
              onSelect={() => setSelectedFund(symbol)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
