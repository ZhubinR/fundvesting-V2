"use client";

import { cn } from "@/shared/lib/utils";
import { useMarketTick } from "@/shared/websocket/use-market-socket";
import { FUND_NAME_MAP } from "../constants";
import type { FundSymbol } from "../types";

export function FundQuoteCard({
  symbol,
  fallbackPrice,
  isActive,
  onSelect,
}: {
  symbol: FundSymbol;
  fallbackPrice: number | null;
  isActive: boolean;
  onSelect: () => void;
}) {
  const tick = useMarketTick(symbol);
  const price = tick?.last_pr ?? fallbackPrice;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "place-self-auto px-3 py-2 shadow-md rounded-lg flex items-center justify-between cursor-pointer text-right",
        isActive ? "bg-primary-500" : "bg-background-500 dark:bg-white",
      )}
    >
      <span className="text-sm text-background-100 dark:text-background-800 font-medium w-fit">
        {FUND_NAME_MAP[symbol] ?? symbol}
      </span>
      <span
        className={cn(
          "lg:text-[18px] text-[16px] font-semibold flex gap-1 items-center",
          isActive ? "text-primary-900" : "text-secondary-300",
        )}
      >
        {price !== null ? price.toLocaleString("fa-IR") : "—"}
        <span className={cn("text-[12px]", isActive ? "text-primary-800" : "text-background-300")}> ریال</span>
      </span>
    </button>
  );
}
