import Image from "next/image";
import { CalendarIcon } from "@/shared/ui/icons";
import { toPersianDigits } from "@/shared/lib/persian-digits";

export function TitleSection({
  text,
  desc,
  date,
  thumbnail,
}: {
  text: string;
  desc: string;
  /** Already formatted (e.g. a Jalali date string) — this only localizes digits. */
  date?: string | null;
  thumbnail?: string;
}) {
  return (
    <section className="pt-6 bg-cover bg-center bg-no-repeat relative rounded-2xl overflow-hidden">
      <h1 className="font-bold relative z-[2] w-full text-white dark:text-background-500 text-center mb-3 lg:text-right text-xl md:text-2xl lg:text-3xl">
        {text}
      </h1>
      <p className="text-background-300 dark:text-neutral-700 mb-3 font-medium relative z-[2] text-center lg:text-right">
        {desc}
      </p>
      {date && (
        <div className="w-fit bg-primary-500 bg-opacity-10 border mx-auto lg:mx-0 border-primary-500 flex px-2 py-1 rounded-full gap-2 relative z-[2]">
          <CalendarIcon color="#77B2EE" />
          <span className="text-sm text-center flex items-center justify-center dark:text-primary-500 text-primary-300">
            {toPersianDigits(date)}
          </span>
        </div>
      )}
      {thumbnail && (
        <Image
          src={thumbnail}
          width={1280}
          height={430}
          alt={text}
          className="w-full object-cover object-center rounded-xl overflow-hidden my-16 shadow-wxl"
        />
      )}
    </section>
  );
}
