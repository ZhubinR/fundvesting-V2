# Migration notes

A detailed record of what changed in the rewrite, for anyone diffing against the original code.

## Architecture

| Before | After |
|---|---|
| JavaScript, no types | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Pages did `fetch` + `useState` + `useEffect` + a manual `setTimeout` debounce | TanStack Query (`useFundSeries` / `useFundCategorySeries`); debouncing happens on the *input value*, once, in `useDebouncedValue` |
| One `WebSocket` connection per page/component that called `useWebSocketHook` (the home page alone opened 3) | One connection, opened once in `MarketSocketProvider` at the app root, fanned out via `useSyncExternalStore` |
| Reconnect logic gave up permanently after a fixed number of attempts | Exponential backoff (capped, with jitter) that never gives up, plus an immediate reconnect on the browser's `online` event |
| `compare/page.jsx`: 12 `useState` calls, several keeping each other in sync via `useEffect` | One `useReducer` for UI selection state; chart data, Y-axis domain, and stat-card values are `useMemo` derivations, not separate state |
| Flat `src/app/_components` folder, ~55 files, by *kind* (chart/, ui/, icons/) | `src/features/*` by *domain*, `src/shared/*` for cross-feature infra |
| Two near-duplicate "fund picker with live price" implementations, duplicated formatting logic in 5+ places | `FundQuoteCard` / `FundQuoteGrid` (websocket-aware, only the changed row re-renders), `formatMetricValue` / `formatYAxisTick` (one implementation) |
| `ChartController.jsx` + `ChartcontrollerBar.jsx` (two ~90-line near-duplicates) | One `FundChartControls` component, parameterized |
| 4 date/time libraries installed (`moment`, `dayjs`, `date-fns`, `date-fns-jalali`) for what's actually one calendar conversion | `jalaali-js` only |

## Bugs fixed

- **`calculateYAxisDomain`** didn't filter out `NaN`/missing values before calling `Math.min`/`Math.max` — a single gap in a series broke the whole Y axis. Fixed by filtering first.
- **`BazdehiHandle`** sorted by `item.date`, a field the market API never returns (every other call site uses `datapg`). `new Date(undefined)` → `Invalid Date`, so the sort was silently a no-op. Fixed to sort by `datapg`.
- **Compare page's default fund selection** read `ahromMainData[0].fund` / `ahromMainData[2].fund` — raw indices into the *flat, multi-date* series, not into a list of unique funds. "The 3rd item" was really whichever fund's 3rd date row happened to load first. There was also a literal copy-paste bug: both branches of a ternary read `goldMainData[2]`. Fixed to derive unique funds first, then pick from that list.
- **Stat-card loading state**: `` `${convertToFarsiDigits(bazdehi1)}%` || <Loader/> `` — a template string is always truthy (even `"undefined%"`), so the loading spinner fallback could never actually render for that branch; it showed the literal text "undefined%" while data was loading. Fixed with an explicit `value === null` check.
- **Custom date-range heading text** (`fundBar`, `fundRavand`) checked `if (timeFrame && fromDate && toDate)`, but selecting a custom range always set `timeFrame` to `null` first — so that branch could never be true, and the heading silently went blank instead of saying "selected date range". Fixed to check the date range directly.
- **`GoldCompareChart`**'s "most recent row per fund" dedup compared a `datei` field that the market API doesn't return (always `undefined`), so the comparison never updated past the first row seen per fund. Fixed to compare the real `datapg` field.
- **`normalizeData`'s `YAxisTick` variable** in `fundBar/page.jsx` called `formatYAxisTick(chartData, query)` — passing the whole array where a single number was expected — and the result was never used anywhere. Removed (the actual Y-axis tick formatter, used correctly elsewhere in the same file, was unaffected).
- **Blog detail page** passed the raw, un-converted Gregorian date straight to `TitleSection` (which only localizes digits, not calendars), while the otherwise-identical news detail page correctly converted to Jalali first. Fixed to match.
- **`robots.txt`** disallow rules are now generated from `app/robots.ts` with the same rules as the original static file (`*?*`, `*/dashboard`, `*/auth`, `*/api`, `*/_next`) instead of living in an easily-overlooked static file disconnected from the rest of the app config.

## Dead code removed

Confirmed unused (no imports anywhere in the codebase) and not carried over:

- `services/http/FetchHook.js`, `services/myScript.jsx`, `services/getToken.js` (the WASM-token plumbing — the token file itself, `public/token.js`, is kept; see the README)
- `utils/BazdehiHandler.js` (a second, unused implementation — the one actually used, `BazdehiHandle`, lived inside `RavandHandler.js` and is the one this rewrite kept)
- `_components/home/BoxesSection.jsx` + `numberBox/NumberBox.jsx`
- `_components/buttons/RoutBtn.jsx`, and the unused `BtnSec` / `BtnOutlineSec` exports from `Btn.jsx` / `BtnOutline.jsx`
- `_components/header/searchBox/SearchBox.jsx`
- `_components/mainChart/MainChartBox.jsx`
- `_components/ui/alert.jsx`, `calendar.jsx`, `card.jsx`, `dropdown-menu.jsx`, `popover.jsx`, `skeleton.jsx` — shadcn scaffolding that was generated but never rendered anywhere (only `button.jsx` and `chart.jsx` were actually used). Their now-unneeded dependencies (`@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-icons`, `react-day-picker`) were dropped from `package.json` too.
- `src/app/_app.jsx` — a Pages-Router-era `_app.js` left over after the migration to the App Router; it referenced a `NumberContext` that doesn't exist anywhere in `src/app`.
- `src/app/api/proxy/route.js` — a broken route handler (wrong function signature for a Next.js Route Handler; called `fetch('/crawl')` with a relative URL from the server, which can't resolve) that nothing ever called.
- `ChartController.jsx`'s `handleOptionChange` branch, which referenced `chartData` / `setChartData` / `normalizeData` — none of which existed in that file's scope. Would have thrown if ever invoked; nothing invoked it.

## Deliberate behavior changes

- **Each fund-data page now fetches only the visible category** (ahrom *or* gold) instead of always fetching both, except the home page, which genuinely shows both at once.
- **Selecting a preset time frame now always clears any custom date range, and vice versa** — previously you could end up with a custom range silently overriding a time-frame button click with no visual feedback.
- **CMS content fetches for blog/news now happen server-side** (Server Components) instead of client-side via `useEffect`, and `generateStaticParams` degrades to on-demand rendering instead of failing the whole production build if the CMS is briefly unreachable at build time.
- **New: placeholder/demo data fallback.** Every data-fetching call (market series, realtime ticks, blog/news, gold-weight options) now falls back to realistic placeholder data — with a clearly-labeled notice — if the real backend can't be reached, instead of an empty or broken page. See the README's "When the backend is unreachable" section. Opt out with `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=false`.
- **Mobile sidebar links now close the menu on tap** — previously the menu stayed open after navigating.
- A couple of homepage/about-page **duplicated content blocks** (the same paragraph rendered twice due to a copy-paste in the JSX) were de-duplicated.

## Verified

- `npm run typecheck` — zero errors.
- `npm run build` — compiles and lints clean (zero warnings), and **all 23 routes build successfully**, including the ones that depend on the live backend (`/`, `/blog`, `/news`, `/sitemap.xml`, and the generated blog/news detail pages) — verified with no network access to `fundvesting-panel.liara.run` / `fundvesting.liara.run` at all, which is exactly the scenario the demo-data fallback exists for.
