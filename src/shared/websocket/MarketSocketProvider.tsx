"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import type { MarketTickMap } from "@/features/funds/types";
import { MarketSocketStore } from "./market-socket-store";

const MarketSocketContext = createContext<MarketSocketStore | null>(null);

export function MarketSocketProvider({
  url,
  getFallbackTicks,
  children,
}: {
  url: string;
  getFallbackTicks?: () => MarketTickMap;
  children: ReactNode;
}) {
  const storeRef = useRef<MarketSocketStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new MarketSocketStore(url, getFallbackTicks);
  }
  const store = storeRef.current;

  useEffect(() => {
    store.connect();
    return () => store.disconnect();
  }, [store]);

  return <MarketSocketContext.Provider value={store}>{children}</MarketSocketContext.Provider>;
}

export function useMarketSocketStore(): MarketSocketStore {
  const store = useContext(MarketSocketContext);
  if (!store) {
    throw new Error("useMarketSocketStore must be used within a MarketSocketProvider");
  }
  return store;
}
