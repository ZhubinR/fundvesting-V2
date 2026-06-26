import Link from "next/link";

export function Btn({ slug, text }: { slug: string; text: string }) {
  return (
    <Link href={slug} className="md:w-fit block min-w-[128px]">
      <div className="bg-primary-500 hover:bg-secondary-500 transition-all rounded-md text-white lg:px-[16px] px-[10px] text-center lg:py-[8px] py-[5px] lg:text-[16px] text-[14px] font-medium md:w-fit w-full">
        {text}
      </div>
    </Link>
  );
}
