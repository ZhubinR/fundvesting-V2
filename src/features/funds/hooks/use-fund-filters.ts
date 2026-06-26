"use client";

import { useCallback, useReducer } from "react";
import type { DateRange } from "../components/FundChartControls";
import { DEFAULT_METRIC, DEFAULT_TIME_FRAME } from "../constants";
import type { FundCategory, FundMetricKey, TimeFrameDays } from "../types";

export interface FundFilterState {
  category: FundCategory;
  metric: FundMetricKey;
  timeFrame: TimeFrameDays | null;
  dateRange: DateRange;
}

type FundFilterAction =
  | { type: "SELECT_CATEGORY"; category: FundCategory }
  | { type: "SET_METRIC"; metric: FundMetricKey }
  | { type: "SET_TIME_FRAME"; timeFrame: TimeFrameDays }
  | { type: "SET_DATE_RANGE"; range: DateRange };

const initialState: FundFilterState = {
  category: "ahrom",
  metric: DEFAULT_METRIC,
  timeFrame: DEFAULT_TIME_FRAME,
  dateRange: { from: null, to: null },
};

function reducer(state: FundFilterState, action: FundFilterAction): FundFilterState {
  switch (action.type) {
    case "SELECT_CATEGORY":
      if (action.category === state.category) return state;
      return { ...state, category: action.category, metric: DEFAULT_METRIC };
    case "SET_METRIC":
      return { ...state, metric: action.metric };
    case "SET_TIME_FRAME":
      return { ...state, timeFrame: action.timeFrame, dateRange: { from: null, to: null } };
    case "SET_DATE_RANGE":
      return { ...state, timeFrame: null, dateRange: action.range };
    default:
      return state;
  }
}

export function useFundFilters() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    selectCategory: useCallback((category: FundCategory) => dispatch({ type: "SELECT_CATEGORY", category }), []),
    setMetric: useCallback((metric: FundMetricKey) => dispatch({ type: "SET_METRIC", metric }), []),
    setTimeFrame: useCallback((timeFrame: TimeFrameDays) => dispatch({ type: "SET_TIME_FRAME", timeFrame }), []),
    setDateRange: useCallback((range: DateRange) => dispatch({ type: "SET_DATE_RANGE", range }), []),
  };
}
