import Image from "next/image";
import { Btn } from "@/shared/ui/Btn";
import { BtnOutline } from "@/shared/ui/BtnOutline";

export function HomeAboutSection() {
  return (
    <section className="grid md:grid-cols-2 grid-cols-1 gap-5 my-20">
      <div className="self-center">
        <div className="flex gap-3 items-center mb-4">
          <span className="w-[3px] h-[42px] bg-secondary-500 rounded-full" />
          <div>
            <h2 className="font-bold text-primary-500 text-[24px] mb-0">
              سرمایه‌گذاری، ساده‌تر از همیشه!
            </h2>
          </div>
        </div>
        <p className="text-background-200 dark:text-darkBackground-500 lg:text-[17px] text-sm lg:font-normal font-light mb-3">
          در فاندوستینگ، ما اعتقاد داریم که همه باید به ابزارهای پیشرفته و داده‌های دقیق سرمایه‌گذاری دسترسی
          داشته باشند. هدف ما این است که اطلاعات صندوق‌های سرمایه‌گذاری را از پیچیدگی خارج کنیم و با ارائه
          نمودارهای بصری و ابزارهای هوشمند، تصمیم‌گیری مالی را برای شما آسان کنیم.
        </p>
        <p className="text-background-200 dark:text-darkBackground-500 lg:text-[17px] text-sm lg:font-normal font-light mb-3">
          ما اینجاییم تا فرآیند تحلیل و مقایسه را به تجربه‌ای ساده، لذت‌بخش و شفاف تبدیل کنیم. همه چیز طراحی
          شده تا شما سریع‌تر به نتیجه برسید و هوشمندانه‌تر عمل کنید.
        </p>
        <p className="text-background-200 dark:text-darkBackground-500 lg:text-[17px] text-sm lg:font-normal font-light mb-5">
          همراه شما برای سرمایه‌گذاری آگاهانه و آسان!
        </p>
        <div className="flex gap-4">
          <Btn slug="/fundBar" text="صفخه جامع صندوق ها" />
          <BtnOutline slug="/fundRavand" text="مشاهده روند صندوق ها" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image
          className="object-cover object-center w-full mix-blend-lighten rounded-3xl shadow-2xl"
          src="/images/aboutPic.webp"
          quality={100}
          width={656}
          height={368}
          alt="about picture"
        />
      </div>
    </section>
  );
}
