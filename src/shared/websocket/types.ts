import type { MarketTickMap } from "@/features/funds/types";

export type MarketSocketStatus = "connecting" | "open" | "closed" | "error";

/** The only message shape the backend actually sends: a full snapshot keyed by fund symbol. */
export interface MarketSocketMessage {
  fund?: MarketTickMap;
}

export type MarketSocketListener = () => void;
