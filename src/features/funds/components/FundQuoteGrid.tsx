"use client";

import { FundQuoteCard } from "./FundQuoteCard";
import type { FundSymbol } from "../types";

export interface FundQuoteOption {
  symbol: FundSymbol;
  fallbackPrice: number | null;
}

export function FundQuoteGrid({
  title,
  funds,
  activeFund,
  onSelect,
}: {
  title: string;
  funds: FundQuoteOption[];
  activeFund: FundSymbol | null;
  onSelect: (symbol: FundSymbol) => void;
}) {
  return (
    <div className="shadow-lg rounded-2xl lg:w-1/2 w-full bg-mid dark:bg-[#eeeeee] p-4 mb-5">
      <div className="w-full flex items-center justify-center mb-4">
        <p className="text-white dark:text-neutral-800 font-semibold text-[20px]">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {funds.map(({ symbol, fallbackPrice }) => (
          <FundQuoteCard
            key={symbol}
            symbol={symbol}
            fallbackPrice={fallbackPrice}
            isActive={activeFund === symbol}
            onSelect={() => onSelect(symbol)}
          />
        ))}
      </div>
    </div>
  );
}
