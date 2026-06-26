import Link from "next/link";

export function BtnOutline({ slug, text }: { slug: string; text: string }) {
  return (
    <Link href={slug} className="w-fit block">
      <div className="border lg:border-2 transition-all border-primary-500 hover:border-secondary-500 rounded-md text-primary-500 hover:text-secondary-500 lg:px-[16px] px-[10px] lg:py-[8px] py-[5px] lg:text-[16px] text-[14px] font-medium w-fit">
        {text}
      </div>
    </Link>
  );
}
