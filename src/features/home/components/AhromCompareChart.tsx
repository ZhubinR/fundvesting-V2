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
import type { FundDataPoint, FundMetricKey, FundSymbol } from "@/features/funds/types";

type AhromDataType = "bub" | "cl_levrat" | "rl_levrat";

const DATA_TYPE_LABELS: Record<AhromDataType, string> = {
  bub: "حباب لحظه ای",
  cl_levrat: "ضریب اهرم کلاسیک",
  rl_levrat: "ضریب اهرم واقعی",
};

const DATA_TYPE_METRIC: Record<AhromDataType, FundMetricKey> = {
  bub: "fin_bub",
  cl_levrat: "cl_levrat",
  rl_levrat: "rl_levrat",
};

interface BubChartPoint {
  fund: FundSymbol;
  value: number;
}

export function AhromCompareChart({ title, data }: { title: string; data: readonly FundDataPoint[] }) {
  const [dataType, setDataType] = useState<AhromDataType>("bub");
  const fontSize = useResponsiveChartFontSize();
  const ticks = useMarketTicks();

  const chartData = useMemo<BubChartPoint[]>(() => {
    const latestByFund = new Map<FundSymbol, number>();

    for (const point of data) {
      let value: number | null;
      if (dataType === "bub") {
        const tick = ticks[point.fund];
        if (!tick || tick.last_pr === undefined || tick.nav === undefined) continue;
        value = ((tick.last_pr - tick.nav) / tick.nav) * 100;
      } else {
        value = point[dataType] ?? null;
      }
      if (value !== null) latestByFund.set(point.fund, value);
    }

    return Array.from(latestByFund.entries())
      .map(([fund, value]) => ({ fund, value }))
      .sort((a, b) => b.value - a.value);
  }, [data, ticks, dataType]);

  const yAxisDomain = useMemo<[number, number] | undefined>(() => {
    if (chartData.length === 0) return undefined;
    const values = chartData.map((p) => p.value);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    return [min < 0 ? min : 0, max];
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1f203485] dark:bg-[#dfdfdf] rounded-2xl w-full h-[350px] flex items-center justify-center">
        <RiseLoader color="#51537B" />
      </div>
    );
  }

  const metric = DATA_TYPE_METRIC[dataType];

  return (
    <div className="xl:rounded-2xl rounded-xl bg-background-800 dark:bg-darkBackground-100 shadow-md lg:w-1/2 xl:p-4 p-3 mb-4 lg:mb-0">
      <p className="lg:hidden text-background-100 dark:text-darkBackground-500 font-light text-center text-sm mb-4">
        شما میتوانید نمودار را اسکرول کنید
      </p>
      <div className="flex items-center md:justify-between flex-col md:flex-row gap-4 md:gap-0">
        <BoxTitle titleText={title} textSize="16px" />
        <BtnOutline slug="/fundBar" text="صفحه جامع" />
      </div>
      <div className="overflow-x-scroll md:overflow-visible">
        <div className="xl:h-[400px] h-[300px] mb-2 p-1 min-w-[500px]">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="fund"
                tickFormatter={(fund) => FUND_NAME_MAP[fund as FundSymbol] ?? fund}
                tickLine={false}
                style={{ fontSize: `${fontSize}px` }}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => {
                  const numericValue = Number(value);
                  return Number.isFinite(numericValue) ? formatMetricValue(numericValue, metric) : "";
                }}
                tickLine={false}
                style={{ fontSize: `${fontSize}px` }}
                axisLine={false}
                tickMargin={10}
                domain={yAxisDomain}
              />
              <ReferenceLine y={0} stroke="#3D3E5C" />
              <Tooltip content={<AhromTooltip metric={metric} />} />
              <Bar dataKey="value" fill="#3C91E6" radius={[50, 50, 0, 0]} barSize={45}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: unknown) => {
                    const numericValue = Number(value);
                    return Number.isFinite(numericValue) ? formatMetricValue(numericValue, metric) : "";
                  }}
                  style={{ fill: "#000", fontSize }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex md:flex-row flex-col justify-center items-center w-full gap-3 xl:gap-5 p-1 xl:p-2 bg-background-500 dark:bg-[#dfdfdf] rounded-md shadow-md">
          {(Object.keys(DATA_TYPE_LABELS) as AhromDataType[]).map((key) => (
            <Button
              key={key}
              className={
                dataType === key
                  ? "bg-secondary-500 text-white w-full"
                  : "bg-transparent text-primary-500 border-primary-500 border w-full"
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

function AhromTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  metric: FundMetricKey;
}) {
  if (!active || !payload?.length) return null;
  const fundName = FUND_NAME_MAP[label as FundSymbol] ?? label;

  return (
    <div className="bg-background-100 border border-background-400 rounded p-2 shadow-sm">
      <p className="text-sm text-background-500 font-medium">{fundName}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-semibold text-primary-700">
          {entry.value !== undefined ? formatMetricValue(entry.value, metric) : "N/A"}
        </p>
      ))}
    </div>
  );
}
