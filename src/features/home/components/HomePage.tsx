"use client";

import Image from "next/image";
import { DemoDataNotice } from "@/shared/ui/DemoDataNotice";
import { EMPTY_FUND_RESULT, useFundSeries } from "@/features/funds/api/funds-queries";
import { AHROM_SYMBOLS, GOLD_SYMBOLS } from "@/features/funds/constants";
import type { Post, GoldWeightOption } from "@/features/content/types";
import { TopChartSection } from "./TopChartSection";
import { MainChartSection } from "./MainChartSection";
import { HomeCtaSection } from "./HomeCtaSection";
import { HomeBlogSection } from "./HomeBlogSection";
import { HomeAboutSection } from "./HomeAboutSection";

export function HomePage({
  posts,
  goldWeightOptions,
  isContentDemo,
}: {
  posts: Post[];
  goldWeightOptions: GoldWeightOption[];
  isContentDemo: boolean;
}) {
  const goldTrend = useFundSeries({ symbols: GOLD_SYMBOLS, metrics: ["fin_pr", "id"], intervalDays: 31 });
  const ahromTrend = useFundSeries({ symbols: AHROM_SYMBOLS, metrics: ["fin_pr", "id"], intervalDays: 31 });
  const goldSnapshot = useFundSeries({ symbols: GOLD_SYMBOLS, metrics: ["nav", "id"], intervalDays: 5 });
  const ahromSnapshot = useFundSeries({
    symbols: AHROM_SYMBOLS,
    metrics: ["nav", "cl_levrat", "rl_levrat", "id"],
    intervalDays: 5,
  });

  const { value: ahromSnapshotData, isDemo: isAhromSnapshotDemo } = ahromSnapshot.data ?? EMPTY_FUND_RESULT;
  const { value: goldSnapshotData, isDemo: isGoldSnapshotDemo } = goldSnapshot.data ?? EMPTY_FUND_RESULT;
  const { value: ahromTrendData, isDemo: isAhromTrendDemo } = ahromTrend.data ?? EMPTY_FUND_RESULT;
  const { value: goldTrendData, isDemo: isGoldTrendDemo } = goldTrend.data ?? EMPTY_FUND_RESULT;

  const isAnyDemo =
    isContentDemo || isAhromSnapshotDemo || isGoldSnapshotDemo || isAhromTrendDemo || isGoldTrendDemo;

  return (
    <>
      <div className="flex flex-col gap-5 py-12 w-full relative z-0 items-center justify-center">
        <Image src="/images/logos/logoSingle.png" width={128} height={128} alt="logo single" />
        <h1 className="xl:text-4xl lg:text-2xl text-[20px] text-secondary-500 font-bold text-center">
          فاندوستینگ
        </h1>
        <p className="xl:text-[20px] lg:text-lg text-center text-base text-background-200 dark:text-darkBackground-500">
          آسان‌تر از همیشه صندوق‌ها را مقایسه کنید!
        </p>
        {isAnyDemo && <DemoDataNotice className="max-w-md" />}
      </div>
      <div className="relative z-10">
        <TopChartSection
          ahromData={ahromSnapshotData}
          goldData={goldSnapshotData}
          goldWeightOptions={goldWeightOptions}
        />
        <MainChartSection ahromData={ahromTrendData} goldData={goldTrendData} />
        <HomeCtaSection />
        <HomeBlogSection posts={posts} />
        <HomeAboutSection />
      </div>
    </>
  );
}
