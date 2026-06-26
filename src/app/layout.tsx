import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryProvider } from "@/shared/api/query-provider";
import { env } from "@/shared/lib/env";
import { FundsSocketProvider } from "@/features/funds/components/FundsSocketProvider";
import { Footer } from "@/features/layout/components/Footer";
import { SideBar } from "@/features/layout/components/SideBar";
import { AppShell } from "@/features/layout/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "فاندوستینگ",
  description: "آسان‌تر از همیشه صندوق‌ها را مقایسه کنید!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#151726] dark:bg-[#e0e0e0] relative overflow-x-hidden">
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
        <QueryProvider>
          <FundsSocketProvider
            url={env.NEXT_PUBLIC_MARKET_WS_URL}
            enableDemoFallback={env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK}
          >
            <SideBar />
            <AppShell />
            <main className="lg:ml-6 lg:mr-[94px] mx-4">{children}</main>
            <Footer />
          </FundsSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
