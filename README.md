# فاندوستینگ — Fundvesting Web

A Next.js (App Router) frontend for Iranian mutual fund market data — historical trends, point-in-time comparisons, a fund-vs-fund comparison tool, and a CMS-backed blog/news section.

This is a from-scratch architectural rewrite of the original JavaScript codebase: TypeScript everywhere, a feature-based folder structure, React Query for data fetching, and a single shared WebSocket connection for realtime prices. See [`MIGRATION.md`](./MIGRATION.md) for a detailed list of what changed and why.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (`strict`, `noUncheckedIndexedAccess`)
- **TanStack Query** for all server-state (market-data fetching, caching, retries)
- **Recharts** for charts, via the shared `shadcn/ui` chart wrapper
- **Tailwind CSS**
- **Zod** for environment-variable validation

## Getting started

```bash
npm install
cp .env.example .env.local   # defaults already match production; override if needed
npm run dev
```

Other scripts:

```bash
npm run build       # production build
npm run typecheck    # tsc --noEmit
npm run lint          # next lint
```

## Project structure

```
src/
├── app/                  # Next.js routes only — every page is a thin wrapper
│   ├── compare/page.tsx
│   ├── fundBar/page.tsx        # URL kept as-is for SEO continuity
│   ├── fundRavand/page.tsx     # URL kept as-is for SEO continuity
│   ├── blog/, news/
│   └── ...
├── features/              # Feature-based modules — this is where the logic lives
│   ├── funds/              # Shared market-data domain (types, API, formatting,
│   │                       # normalization, chart controls, fund quote cards)
│   ├── compare/            # /compare page
│   ├── fund-bar/           # /fundBar page
│   ├── fund-trend/         # /fundRavand page
│   ├── home/               # / page
│   ├── content/            # blog/news (Directus CMS client)
│   ├── layout/             # header, sidebars, footer, nav
│   └── contact/
└── shared/                 # Cross-feature infrastructure
    ├── api/                 # fetch wrapper, React Query provider
    ├── websocket/           # the single shared market-data socket
    ├── lib/                 # env validation, Jalali dates, Persian digits, etc.
    └── ui/                  # shadcn primitives actually used by the app
```

**Why feature-based?** Each page that deals with fund data (compare, fund-bar,
fund-trend, home) used to carry its own ~150–300 line copy of: fetching logic,
a `RavandHandler`/`normalizeData`-style data transform, Y-axis domain math, a
tooltip formatter, and a "fund picker with live price" list. `features/funds`
now holds each of those exactly once, typed, and every page composes them.

## Environment variables

See [`.env.example`](./.env.example). Defaults match the production backend, so the app runs with zero configuration for local development — override only if you're pointing at a different environment.

## When the backend is unreachable

If the market-data API or the CMS can't be reached — no network access, the backend is down, or you're just running this without any backend at all — every page falls back to realistic, deterministic placeholder data instead of showing an empty or broken page, with a small notice ("در حال نمایش داده‌های نمونه هستید") so it's never mistaken for live data. This is on by default (useful for demos, screenshots, and exploring the codebase without backend access) and covers:

- Market-data series (compare, fund-bar, fund-trend, home charts) — `src/features/funds/mocks.ts`
- The realtime WebSocket snapshot — same file, only applied if no real tick has ever arrived; live data always overwrites it once available
- Blog/news posts and the homepage gold-weight data — `src/features/content/mocks.ts`

The sitemap is the one exception: it **never** includes placeholder post URLs, even with the fallback on, since that would publish fake pages to search engines.

Set `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=false` to disable this entirely and let a real backend failure surface as a real error instead.

## Known gaps carried over from the original app

- **`suggest` page** was an unfinished placeholder (`<div>First</div>`) in the original code; it's still a placeholder here — no functionality was invented for it.
- **The WASM bot-protection token** (`public/token.js`, a compiled `tokenme()` function) is fully present but was never actually wired up to anything in the original app — every request used a single hardcoded literal token instead. That's preserved as-is (see `MARKET_AUTH_TOKEN` in `src/features/funds/constants.ts`); wiring up the real token generator would be a backend-coordinated change, not a frontend refactor.
