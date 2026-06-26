"use client";

import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { useCallback, useReducer } from "react";
import type { DateRange } from "@/features/funds/components/FundChartControls";
import { AHROM_SYMBOLS, DEFAULT_METRIC, DEFAULT_TIME_FRAME, GOLD_SYMBOLS } from "@/features/funds/constants";
import type { FundCategory, FundMetricKey, FundSymbol, TimeFrameDays } from "@/features/funds/types";

interface FundTrendState {
  category: FundCategory;
  metric: FundMetricKey;
  timeFrame: TimeFrameDays | null;
  dateRange: DateRange;
  fund: FundSymbol | null;
}

type FundTrendAction =
  | { type: "SELECT_CATEGORY"; category: FundCategory }
  | { type: "SET_METRIC"; metric: FundMetricKey }
  | { type: "SET_TIME_FRAME"; timeFrame: TimeFrameDays }
  | { type: "SET_DATE_RANGE"; range: DateRange }
  | { type: "SELECT_FUND"; fund: FundSymbol }
  | { type: "ENSURE_DEFAULT_FUND"; fund: FundSymbol };

const VALID_TIME_FRAMES: readonly number[] = [31, 91, 184, 366];

function isFundSymbol(value: string): value is FundSymbol {
  return (AHROM_SYMBOLS as readonly string[]).includes(value) || (GOLD_SYMBOLS as readonly string[]).includes(value);
}

function getInitialState(searchParams: ReadonlyURLSearchParams): FundTrendState {
  const category: FundCategory = searchParams.get("tab") === "gold" ? "gold" : "ahrom";
  const timeFrameParam = Number(searchParams.get("timeFrame"));
  const timeFrame = VALID_TIME_FRAMES.includes(timeFrameParam) ? (timeFrameParam as TimeFrameDays) : DEFAULT_TIME_FRAME;
  const fundParam = searchParams.get("myfund") ?? "";

  return {
    category,
    metric: DEFAULT_METRIC,
    timeFrame,
    dateRange: { from: null, to: null },
    fund: isFundSymbol(fundParam) ? fundParam : null,
  };
}

function reducer(state: FundTrendState, action: FundTrendAction): FundTrendState {
  switch (action.type) {
    case "SELECT_CATEGORY":
      if (action.category === state.category) return state;
      return { ...state, category: action.category, metric: DEFAULT_METRIC, fund: null };
    case "SET_METRIC":
      return { ...state, metric: action.metric };
    case "SET_TIME_FRAME":
      return { ...state, timeFrame: action.timeFrame, dateRange: { from: null, to: null } };
    case "SET_DATE_RANGE":
      return { ...state, timeFrame: null, dateRange: action.range };
    case "SELECT_FUND":
      return { ...state, fund: action.fund };
    case "ENSURE_DEFAULT_FUND":
      return state.fund ? state : { ...state, fund: action.fund };
    default:
      return state;
  }
}

export function useFundTrendState() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, searchParams, getInitialState);

  return {
    state,
    selectCategory: useCallback((category: FundCategory) => dispatch({ type: "SELECT_CATEGORY", category }), []),
    setMetric: useCallback((metric: FundMetricKey) => dispatch({ type: "SET_METRIC", metric }), []),
    setTimeFrame: useCallback((timeFrame: TimeFrameDays) => dispatch({ type: "SET_TIME_FRAME", timeFrame }), []),
    setDateRange: useCallback((range: DateRange) => dispatch({ type: "SET_DATE_RANGE", range }), []),
    selectFund: useCallback((fund: FundSymbol) => dispatch({ type: "SELECT_FUND", fund }), []),
    ensureDefaultFund: useCallback((fund: FundSymbol) => dispatch({ type: "ENSURE_DEFAULT_FUND", fund }), []),
  };
}
