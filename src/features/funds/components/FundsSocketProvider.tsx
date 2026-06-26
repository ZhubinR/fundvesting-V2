"use client";

import type { ReactNode } from "react";
import { MarketSocketProvider } from "@/shared/websocket/MarketSocketProvider";
import { generateMockMarketTicks } from "../mocks";

export function FundsSocketProvider({
  url,
  enableDemoFallback,
  children,
}: {
  url: string;
  enableDemoFallback: boolean;
  children: ReactNode;
}) {
  return (
    <MarketSocketProvider url={url} getFallbackTicks={enableDemoFallback ? generateMockMarketTicks : undefined}>
      {children}
    </MarketSocketProvider>
  );
}
