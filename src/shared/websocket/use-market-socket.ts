import { useSyncExternalStore } from "react";
import type { FundSymbol, MarketTick, MarketTickMap } from "@/features/funds/types";
import { useMarketSocketStore } from "./MarketSocketProvider";
import type { MarketSocketStatus } from "./types";

/** Connection status, for a "live" indicator. */
export function useMarketSocketStatus(): MarketSocketStatus {
  const store = useMarketSocketStore();
  return useSyncExternalStore(store.subscribe, store.getStatus, () => "connecting" as const);
}

/**
 * The latest tick for a single fund. Only re-renders when *that fund's*
 * data changes — not on every message the socket receives, which is the
 * granularity the old `useWebSocketHook` couldn't offer (it re-rendered
 * every subscriber's entire subtree on every tick for every fund).
 */
export function useMarketTick(symbol: FundSymbol): MarketTick | undefined {
  const store = useMarketSocketStore();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot()[symbol],
    () => undefined,
  );
}

/** The full realtime snapshot, for the rare case a component needs every fund at once. */
export function useMarketTicks(): MarketTickMap {
  const store = useMarketSocketStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => ({}));
}
