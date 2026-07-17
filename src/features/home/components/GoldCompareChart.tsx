"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RiseLoader } from "react-spinners";
import { Button } from "@/shared/ui/button";
import { BoxTitle } from "@/shared/ui/BoxTitle";
import { BtnOutline } from "@/shared/ui/BtnOutline";
import { useResponsiveChartFontSize } from "@/shared/lib/use-responsive-chart-font-size";
import { useMarketTicks } from "@/shared/websocket/use-market-socket";
import { FUND_NAME_MAP } from "@/features/funds/constants";
import { formatMetricValue } from "@/features/funds/lib/format";
import type { FundDataPoint, FundSymbol } from "@/features/funds/types";
import type { GoldWeightOption } from "@/features/content/types";

type GoldDataType = "bub" | "shemsh" | "seke";

const DATA_TYPE_LABELS: Record<GoldDataType, string> = {
  bub: "حباب لحظه ای",
  shemsh: "وزن شمش",
  seke: "وزن سکه",
};

interface GoldChartPoint {
  key: string;
  label: string;
  value: number;
}

export function GoldCompareChart({
  title,
  data,
  weightOptions,
}: {
  title: string;
  data: readonly FundDataPoint[];
  weightOptions: GoldWeightOption[];
}) {
  const [dataType, setDataType] = useState<GoldDataType>("bub");
  const fontSize = useResponsiveChartFontSize();
  const ticks = useMarketTicks();

  // Latest API row per fund, used as the basis for the "bub" (instant
  // bubble) calculation. The original tried to do this by comparing a
  // `datei` field that the market API never returns — every comparison
  // was `undefined > undefined`, so it silently kept whichever row
  // happened to come first instead of the most recent one. Using `datapg`
  // (the field the API actually returns) fixes that.
  const latestByFund = useMemo(() => {
    const map = new Map<FundSymbol, FundDataPoint>();
    for (const point of data) {
      const existing = map.get(point.fund);
      if (!existing || new Date(point.datapg) > new Date(existing.datapg)) {
        map.set(point.fund, point);
      }
    }
    return map;
  }, [data]);

  const latestWeightDate = useMemo(() => {
    for (let i = weightOptions.length - 1; i >= 0; i -= 1) {
      const option = weightOptions[i];
      if (option && option[dataType === "bub" ? "shemsh" : dataType] !== null) return option.date;
    }
    return null;
  }, [weightOptions, dataType]);

  const chartData = useMemo<GoldChartPoint[]>(() => {
    if (dataType === "bub") {
      const points: GoldChartPoint[] = [];
      for (const [fund, point] of latestByFund) {
        const tick = ticks[fund];
        if (!tick || tick.last_pr === undefined || tick.nav === undefined) continue;
        if (point.nav === null || point.nav === undefined) continue;
        points.push({
          key: fund,
          label: FUND_NAME_MAP[fund] ?? fund,
          value: ((tick.last_pr - tick.nav) / tick.nav) * 100,
        });
      }
      return points.sort((a, b) => b.value - a.value);
    }

    return weightOptions
      .filter((option) => option.date === latestWeightDate && option[dataType] !== null)
      .map((option) => ({ key: option.name, label: option.name, value: option[dataType] as number }))
      .sort((a, b) => b.value - a.value);
  }, [dataType, latestByFund, ticks, weightOptions, latestWeightDate]);

  const yAxisDomain = useMemo<[number, number] | undefined>(() => {
    if (chartData.length === 0) return undefined;
    const values = chartData.map((p) => p.value);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    return [min < 0 ? min : 0, max];
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1f203485] rounded-2xl w-full h-[350px] flex items-center justify-center">
        <RiseLoader color="#51537B" />
      </div>
    );
  }

  return (
    <div className="xl:rounded-2xl rounded-xl bg-background-800 dark:bg-darkBackground-100 shadow-md lg:w-1/2 xl:p-4 p-3">
      <p className="lg:hidden text-background-100 dark:text-darkBackground-500 font-light text-center text-sm mb-4">
        شما میتوانید نمودار را اسکرول کنید
      </p>
      <div className="flex md:justify-between items-center flex-col md:flex-row gap-4 md:gap-0">
        <BoxTitle titleText={title} textSize="16px" />
        <BtnOutline slug="/fundBar" text="صفحه جامع" />
      </div>
      <div className="overflow-x-scroll customScrollHorizontal">
        <div className="xl:h-[400px] h-[300px] mb-2 p-1 min-w-[1050px]">
          <ResponsiveContainer className="min-w-[1050px]">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} style={{ fontSize: `${fontSize}px` }} tickMargin={10} axisLine={false} />
              <YAxis
                tickFormatter={(value) => formatMetricValue(Number(value), "fin_bub")}
                tickLine={false}
                style={{ fontSize: `${fontSize}px` }}
                axisLine={false}
                tickMargin={10}
                domain={yAxisDomain}
              />
              <ReferenceLine y={0} stroke="#3D3E5C" />
              <Tooltip content={<GoldTooltip />} />
              <Bar dataKey="value" fill="#3C91E6" radius={[50, 50, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: unknown) => formatMetricValue(Number(value), "fin_bub")}
                  style={{ fill: "#000", fontSize }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex md:flex-row flex-col justify-center items-center w-full gap-3 xl:gap-5 p-1 xl:p-2 bg-background-500 dark:bg-[#dfdfdf] rounded-md shadow-md">
          {(Object.keys(DATA_TYPE_LABELS) as GoldDataType[]).map((key) => (
            <Button
              key={key}
              className={
                dataType === key
                  ? "bg-secondary-500 text-white w-full"
                  : "bg-transparent text-primary-500 border-primary-500 w-full text-[12px] md:text-[14px] px-[8px] lg:border-2 border"
              }
              onClick={() => setDataType(key)}
            >
              {DATA_TYPE_LABELS[key]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoldTooltip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background-100 border border-background-400 rounded p-2 shadow-sm">
      <p className="text-sm text-background-500 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-semibold text-primary-700">
          {entry.value !== undefined ? formatMetricValue(entry.value, "fin_bub") : "N/A"}
        </p>
      ))}
    </div>
  );
}
