"use client";

import { useCallback, useReducer } from "react";
import type { DateRange } from "@/features/funds/components/FundChartControls";
import { DEFAULT_METRIC, DEFAULT_TIME_FRAME } from "@/features/funds/constants";
import type { FundCategory, FundMetricKey, FundSymbol, TimeFrameDays } from "@/features/funds/types";

interface CompareState {
  category: FundCategory;
  metric: FundMetricKey;
  timeFrame: TimeFrameDays | null;
  dateRange: DateRange;
  fund1: FundSymbol | null;
  fund2: FundSymbol | null;
}

type CompareAction =
  | { type: "SELECT_CATEGORY"; category: FundCategory }
  | { type: "SET_METRIC"; metric: FundMetricKey }
  | { type: "SET_TIME_FRAME"; timeFrame: TimeFrameDays }
  | { type: "SET_DATE_RANGE"; range: DateRange }
  | { type: "SELECT_FUND"; slot: 1 | 2; fund: FundSymbol }
  | { type: "ENSURE_DEFAULT_FUNDS"; fund1: FundSymbol; fund2: FundSymbol };

const initialState: CompareState = {
  category: "ahrom",
  metric: DEFAULT_METRIC,
  timeFrame: DEFAULT_TIME_FRAME,
  dateRange: { from: null, to: null },
  fund1: null,
  fund2: null,
};

function reducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case "SELECT_CATEGORY":
      if (action.category === state.category) return state;
      // Switching tabs resets the metric and fund selection — the old
      // code did this too, but via three separate setState calls that
      // could land in the same render or three different ones depending
      // on React's batching, with the metric reset living in a *third*,
      // separate `useEffect([activeTab])`.
      return { ...state, category: action.category, metric: DEFAULT_METRIC, fund1: null, fund2: null };
    case "SET_METRIC":
      return { ...state, metric: action.metric };
    case "SET_TIME_FRAME":
      return { ...state, timeFrame: action.timeFrame, dateRange: { from: null, to: null } };
    case "SET_DATE_RANGE":
      return { ...state, timeFrame: null, dateRange: action.range };
    case "SELECT_FUND":
      return action.slot === 1 ? { ...state, fund1: action.fund } : { ...state, fund2: action.fund };
    case "ENSURE_DEFAULT_FUNDS":
      if (state.fund1 && state.fund2) return state;
      return { ...state, fund1: state.fund1 ?? action.fund1, fund2: state.fund2 ?? action.fund2 };
    default:
      return state;
  }
}

export function useCompareState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    selectCategory: useCallback((category: FundCategory) => dispatch({ type: "SELECT_CATEGORY", category }), []),
    setMetric: useCallback((metric: FundMetricKey) => dispatch({ type: "SET_METRIC", metric }), []),
    setTimeFrame: useCallback((timeFrame: TimeFrameDays) => dispatch({ type: "SET_TIME_FRAME", timeFrame }), []),
    setDateRange: useCallback((range: DateRange) => dispatch({ type: "SET_DATE_RANGE", range }), []),
    selectFund: useCallback((slot: 1 | 2, fund: FundSymbol) => dispatch({ type: "SELECT_FUND", slot, fund }), []),
    ensureDefaultFunds: useCallback(
      (fund1: FundSymbol, fund2: FundSymbol) => dispatch({ type: "ENSURE_DEFAULT_FUNDS", fund1, fund2 }),
      [],
    ),
  };
}
