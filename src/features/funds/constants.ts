import type { FundCategory, FundMetricKey, FundSymbol, TimeFrameDays } from "./types";

export const AHROM_SYMBOLS = [
  "ahrom",
  "tavan",
  "shetab",
  "jahesh",
  "moj",
  "narenj",
  "bidar",
  "dox",
  "pishran",
] as const;

export const GOLD_SYMBOLS = [
  "tala",
  "ayar",
  "kahroba",
  "mesghal",
  "gohar",
  "zar",
  "ganj",
  "javaher",
  "nafis",
  "nab",
  "alton",
  "tabesh",
  "zarfam",
  "derakhshan",
  "lyan",
  "zarvan",
  "ghyrat",
  "atash",
  "zomorod",
  "goldis",
  "emerald",
] as const;

export const FUND_SYMBOLS_BY_CATEGORY: Record<FundCategory, readonly FundSymbol[]> = {
  ahrom: AHROM_SYMBOLS,
  gold: GOLD_SYMBOLS,
};

/**
 * The market API has no symbol-name endpoint; display names are a fixed
 * dictionary. Centralized here instead of duplicated per-page.
 */
export const FUND_NAME_MAP: Record<FundSymbol, string> = {
  tala: "طلا",
  ayar: "عیار",
  kahroba: "کهربا",
  mesghal: "مثقال",
  gohar: "گوهر",
  zar: "زر",
  ganj: "گنج",
  javaher: "جواهر",
  nafis: "نفیس",
  nab: "ناب",
  alton: "آلتون",
  tabesh: "تابش",
  zarfam: "زرفام",
  ahrom: "اهرم",
  tavan: "توان",
  shetab: "شتاب",
  jahesh: "جهش",
  moj: "موج",
  narenj: "نارنج",
  bidar: "بیدار",
  atash: "آتش",
  ghyrat: "قیراط",
  zarvan: "زروان",
  lyan: "لیان",
  derakhshan: "درخشان",
  dox: "دوایکس",
  zomorod: "زمرد",
  goldis: "گلدیس",
  emerald: "امرالد",
  pishran: "پیشران",
};

/** Metric label when describing a *trend over time* (e.g. fund-trend page). */
export const METRIC_TREND_LABEL: Record<FundMetricKey, string> = {
  fin_pr: "بازده نماد",
  nav: "بازده NAV",
  rl_levrat: "روند ضریب اهرم واقعی",
  cl_levrat: "روند ضریب اهرم کلاسیک",
  st_wg: "روند وزن سهام",
  tr_val: "روند ارزش معاملات",
  fin_bub: "روند حباب پایانی",
  net_wass: "روند خالص ارزش دارایی",
  id: "شناسه",
};

/** Metric label for a *single point-in-time value* (e.g. fund-bar page). */
export const METRIC_SNAPSHOT_LABEL: Record<FundMetricKey, string> = {
  fin_pr: "بازده نماد",
  nav: "بازده NAV",
  rl_levrat: "ضریب اهرم واقعی",
  cl_levrat: "ضریب اهرم کلاسیک",
  st_wg: "وزن سهام",
  tr_val: "ارزش معاملات",
  fin_bub: "حباب پایانی",
  net_wass: "خالص ارزش دارایی",
  id: "شناسه",
};

export const TIME_FRAME_OPTIONS: { value: TimeFrameDays; label: string }[] = [
  { value: 31, label: "ماهانه" },
  { value: 91, label: "سه ماهه" },
  { value: 184, label: "شش ماهه" },
  { value: 366, label: "سالانه" },
];

export const DEFAULT_TIME_FRAME: TimeFrameDays = 31;
export const DEFAULT_METRIC: FundMetricKey = "fin_pr";

/**
 * The market API expects a `token` field on every request body and on
 * WebSocket connect. In the previous codebase this literal string was
 * hardcoded in 9 separate files. It is NOT a secret (it ships in client
 * JS either way), but it must stay a single source of truth.
 *
 * Note: the app also ships a WASM-based token generator
 * (`public/token.js`, `getToken()`) that is fully wired up but never
 * actually called anywhere in the old code — dead code, kept here in case
 * the backend is meant to validate it. See ARCHITECTURE.md.
 */
export const MARKET_AUTH_TOKEN = "fundvest2220204";
