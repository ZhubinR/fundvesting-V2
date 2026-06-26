import { Suspense } from "react";
import { FundTrendPage } from "@/features/fund-trend/components/FundTrendPage";

export default function Page() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <FundTrendPage />
    </Suspense>
  );
}
