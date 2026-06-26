import { AhromCompareChart } from "./AhromCompareChart";
import { GoldCompareChart } from "./GoldCompareChart";
import type { FundDataPoint } from "@/features/funds/types";
import type { GoldWeightOption } from "@/features/content/types";

export function TopChartSection({
  ahromData,
  goldData,
  goldWeightOptions,
}: {
  ahromData: readonly FundDataPoint[];
  goldData: readonly FundDataPoint[];
  goldWeightOptions: GoldWeightOption[];
}) {
  return (
    <section className="lg:flex gap-5 mb-5">
      <AhromCompareChart data={ahromData} title="صندوق های اهرمی" />
      <GoldCompareChart data={goldData} weightOptions={goldWeightOptions} title="صندوق های طلا" />
    </section>
  );
}
