// @ts-check

const CONTENT_API_ORIGIN = "https://fundvesting-panel.liara.run";
const MARKET_API_ORIGIN = "https://fundvesting.liara.run";

/**
 * `/crawl/*` and `/panel/*` are same-origin proxies for the market-data API
 * and the Directus content API. Routing through same-origin rewrites (instead
 * of calling the third-party origins directly from the client, as the old
 * code did in some places and not others) means:
 *  - one consistent CSP / cache policy for all data fetching
 *  - no CORS configuration needed on the backends
 *  - the real origin can move without any client code changes
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fundvesting-panel.liara.run",
        pathname: "/assets/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
              `${CONTENT_API_ORIGIN} ${MARKET_API_ORIGIN}/api wss://fundvesting.liara.run/ws;`,
            ].join(" "),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/crawl/:path*", destination: `${MARKET_API_ORIGIN}/api/:path*` },
      { source: "/panel/:path*", destination: `${CONTENT_API_ORIGIN}/items/:path*` },
      { source: "/panel-assets/:path*", destination: `${CONTENT_API_ORIGIN}/assets/:path*` },
    ];
  },
};

export default nextConfig;
