import Image from "next/image";
import { Btn } from "@/shared/ui/Btn";

export function HomeCtaSection() {
  return (
    <section className="mb-16 bg-background-800 dark:bg-[#f3f3f3] rounded-2xl shadow-lg flex md:flex-row flex-col border-2 items-center md:items-start border-primary-500">
      <div className="md:w-3/4 py-5 px-9">
        <div className="mb-8">
          <h3 className="text-[24px] font-semibold text-secondary-500 text-center md:text-right">
            ساده‌تر از همیشه مقایسه کن!
          </h3>
          <p className="text-[16px] text-background-200 dark:text-darkBackground-500 text-center md:text-right">
            صندوق‌های دلخواهت رو با تمام شاخص‌ها کنار هم بررسی کن.
            <span className="text-sm text-primary-400 text-center md:text-right"> برای اولین بار در فاندوستینگ</span>
          </p>
        </div>
        <Btn slug="/compare" text="مقایسه صندوق" />
      </div>
      <Image src="/images/ctaPic.png" width={228} height={181} alt="cta picture" />
    </section>
  );
}
