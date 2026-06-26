import Image from "next/image";
import Link from "next/link";
import { TimeIcon } from "@/shared/ui/icons";
import { toPersianDigits } from "@/shared/lib/persian-digits";

export function BlogCard({
  slug,
  thumbnail,
  title,
  desc,
  date,
}: {
  slug: string;
  thumbnail?: string;
  title: string;
  desc: string;
  /** Already formatted (e.g. a Jalali date string) — this only localizes digits. */
  date: string;
}) {
  return (
    <Link href={slug} className="py-3 px-3 bg-mid dark:bg-darkBackground-200 rounded-2xl shadow-lg">
      {thumbnail && (
        <Image
          className="w-full object-cover object-center rounded-lg mb-3"
          alt={title}
          src={thumbnail}
          width={407}
          height={196}
          quality={80}
          unoptimized
        />
      )}
      <h3 className="text-[16px] font-medium text-white dark:text-[#222] mb-1">{title}</h3>
      <p className="text-[13px] font-light text-background-200 dark:text-darkBackground-500 mb-2 blogDesc flex-grow">
        {desc}
      </p>
      <div className="flex gap-[6px] text-sm text-background-200 dark:text-darkBackground-500 font-medium">
        <TimeIcon />
        {toPersianDigits(date)}
      </div>
    </Link>
  );
}
