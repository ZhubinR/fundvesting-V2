import Image from "next/image";
import { Btn } from "@/shared/ui/Btn";

export default function AboutPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center mb-24 text-center lg:text-start gap-5 container mx-auto">
      <div className="flex items-center justify-center">
        <Image
          src="/images/about.webp"
          width={600}
          height={600}
          alt="about picture"
          className="object-cover object-center border border-[#ffffff73] rounded-[48px] overflow-hidden"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-primary-500 mb-0 lg:mb-4">
          درباره <span className="text-secondary-500 mx-1">فاندوستینگ </span>
          بیشتر بدانید
        </h2>
        <p className="text-background-200 dark:text-neutral-600 lg:text-[17px] text-sm lg:font-normal font-light">
          ما در سال 1401 شروع کردیم، با یک هدف ساده: ساده‌تر کردن تحلیل صندوق‌های سرمایه‌گذاری برای همه. از
          یک کانال تلگرام شروع کردیم و حالا جامعه‌ای داریم که بیش از 15 هزار نفر به ما اعتماد کرده‌اند.
        </p>
        <p className="text-background-200 dark:text-neutral-600 lg:text-[17px] text-sm lg:font-normal font-light">
          ربات تلگرامی ما، که بیش از 7 هزار نفر ازش استفاده کرده‌اند، طراحی شده تا داده‌ها و تحلیل‌های دقیق
          را در سریع‌ترین زمان ممکن به شما ارائه دهد.
        </p>
        <p className="text-background-200 dark:text-neutral-600 lg:text-[17px] text-sm lg:font-normal font-light">
          اما این فقط شروع ماجراست. ما متعهدیم که سرمایه‌گذاری غیرمستقیم رو در ایران به سطح استانداردهای
          جهانی برسونیم و به بلوغ بازار سرمایه کمک کنیم.
        </p>
        <div className="mt-5">
          <p className="text-primary-500 font-medium">
            سوالی دارید؟ <span className="text-secondary-500">پیشنهادی دارید؟</span>
          </p>
          <p className="text-background-200 dark:text-neutral-600 font-medium">
            ما همیشه اینجاییم و دوست داریم صدای شما رو بشنویم
          </p>
          <div className="mt-5">
            <Btn slug="/contact" text="با ما در اتباط باشید" />
          </div>
        </div>
      </div>
    </section>
  );
}
