import Link from "next/link";
import { BarChartIcon, CompareIcon, FundsIcon } from "@/shared/ui/icons";
import { toPersianDigits } from "@/shared/lib/persian-digits";

const ARROW_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

const SUGGESTED_LINKS = [
  {
    href: "/fundRavand",
    Icon: FundsIcon,
    title: "روند صندوق ها",
    description: "روند بازار را در بازه زمانی دلخواه ببنید.",
    linkText: "صفحه روند صندوق‌ها",
  },
  {
    href: "/fundBar",
    Icon: BarChartIcon,
    title: "صفحه جامع صندوق ها",
    description: "هرچیزی که راجع به یک صندوق باید بدونی.",
    linkText: "صفحه جامع صندوق ها",
  },
  {
    href: "/compare",
    Icon: CompareIcon,
    title: "مقایسه صندوق‌ها",
    description: "صندوق هارو با هم مقایسه کنید.",
    linkText: "صفحه مقایسه",
  },
];

export default function NotFound() {
  return (
    <section className="bg-background-800 dark:bg-[#eee] rounded-3xl mb-6">
      <div className="container flex items-center justify-center px-6 mx-auto py-20">
        <div className="w-full">
          <div className="flex flex-col items-center max-w-lg mx-auto text-center">
            <p className="text-4xl font-bold text-primary-500">{toPersianDigits(404)}</p>
            <h1 className="mt-3 text-2xl font-semibold text-white dark:text-neutral-800 md:text-3xl">
              صفحه مورد نظر یافت نشد !!
            </h1>
            <p className="mt-4 text-background-200 dark:text-neutral-600">
              ما زمین و زمان رو به هم دوختیم ولی اون چیزی که دنبالشیو پیدا نکردیم. مطمئنیم تو صفحه های زیر
              پیداش میکنی !
            </p>

            <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
              <Link
                href="/"
                className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 font-medium bg-secondary-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600"
              >
                برو به خانه
              </Link>
              <Link
                href="/about"
                className="w-1/2 px-5 py-2 text-sm tracking-wide text-secondary-500 transition-colors font-medium duration-200 border-2 border-secondary-500 rounded-lg shrink-0 sm:w-auto hover:text-blue-500 hover:border-blue-600"
              >
                درباره فاندوستینگ
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 mx-auto mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {SUGGESTED_LINKS.map(({ href, Icon, title, description, linkText }) => (
              <div key={href} className="p-6 rounded-2xl bg-background-900 dark:bg-darkBackground-200">
                <span className="text-gray-400 dark:text-neutral-700 w-fit flex">
                  <Icon color="currentColor" />
                </span>
                <h3 className="mt-6 font-medium text-white dark:text-neutral-800">{title}</h3>
                <p className="mt-2 text-background-300 dark:text-neutral-600">{description}</p>
                <Link href={href} className="inline-flex items-center mt-4 text-sm gap-x-2 text-primary-400 hover:underline">
                  <span>{linkText}</span>
                  {ARROW_ICON}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
