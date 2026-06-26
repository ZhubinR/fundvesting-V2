import { AHROM_SYMBOLS, GOLD_SYMBOLS } from "./constants";
import type { FundDataPoint, FundMetricKey, FundSymbol, MarketTickMap } from "./types";

const ALL_SYMBOLS: readonly FundSymbol[] = [...AHROM_SYMBOLS, ...GOLD_SYMBOLS];

/** A baseline value per metric so different metrics don't all look identical. */
const BASE_VALUE_BY_METRIC: Partial<Record<FundMetricKey, number>> = {
  fin_pr: 18_500,
  nav: 18_200,
  rl_levrat: 185,
  cl_levrat: 160,
  st_wg: 62,
  tr_val: 6_500_000_000,
  fin_bub: 1.8,
  net_wass: 420_000_000_000,
};

/** Tiny seeded PRNG (mulberry32) — deterministic per seed, no extra dependency. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromSymbol(symbol: string): number {
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function isoDateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export interface MockFundSeriesParams {
  symbols: readonly FundSymbol[] | readonly ["*"];
  metrics: readonly FundMetricKey[];
  intervalDays?: number;
  from?: string | null;
  to?: string | null;
}

/**
 * Generates a plausible-looking daily series per requested symbol/metric —
 * a gentle random walk with a slight upward drift, like a real market.
 * Deterministic per symbol so the "history" doesn't visibly jitter
 * between renders or requests.
 */
export function generateMockFundSeries(params: MockFundSeriesParams): FundDataPoint[] {
  const symbols = params.symbols[0] === "*" ? ALL_SYMBOLS : (params.symbols as readonly FundSymbol[]);
  const days = Math.max(params.intervalDays ?? 31, 5);

  const points: FundDataPoint[] = [];

  for (const symbol of symbols) {
    const random = createRandom(seedFromSymbol(symbol));
    const runningValue: Partial<Record<FundMetricKey, number>> = {};
    for (const metric of params.metrics) {
      const base = BASE_VALUE_BY_METRIC[metric] ?? 100;
      // Spread each fund's starting point out a bit so a chart with many
      // funds doesn't show them all stacked on the exact same line.
      runningValue[metric] = base * (0.85 + random() * 0.3);
    }

    for (let dayOffset = days; dayOffset >= 0; dayOffset -= 1) {
      const point: FundDataPoint = { fund: symbol, datapg: isoDateDaysAgo(dayOffset) };

      for (const metric of params.metrics) {
        if (metric === "id") {
          point.id = seedFromSymbol(symbol) % 1000;
          continue;
        }
        const current = runningValue[metric] ?? BASE_VALUE_BY_METRIC[metric] ?? 100;
        const drift = (random() - 0.47) * 0.025;
        const next = Math.max(current * (1 + drift), 1);
        runningValue[metric] = next;
        point[metric] = Math.round(next * 100) / 100;
      }

      points.push(point);
    }
  }

  return points;
}

/** A realtime-looking snapshot for every known fund, for when the websocket can't connect at all. */
export function generateMockMarketTicks(): MarketTickMap {
  const ticks: MarketTickMap = {};

  for (const symbol of ALL_SYMBOLS) {
    const random = createRandom(seedFromSymbol(symbol) + 1);
    const nav = (BASE_VALUE_BY_METRIC.nav ?? 18_000) * (0.85 + random() * 0.3);
    const bubble = (random() - 0.3) * 0.03; // small, mostly-positive bubble over NAV
    ticks[symbol] = {
      nav: Math.round(nav * 100) / 100,
      last_pr: Math.round(nav * (1 + bubble) * 100) / 100,
    };
  }

  return ticks;
}
