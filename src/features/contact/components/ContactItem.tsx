import Image from "next/image";
import Link from "next/link";

export function ContactItem({ icon, text, href }: { icon: string; text: string; href: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background-800 dark:bg-[#eee] shadow-lg h-full group cursor-pointer">
      <div className="flex items-center justify-center p-3 rounded-full transition-all bg-secondary-500 w-fit group-hover:bg-primary-500">
        <Image src={icon} alt="icon" width={36} height={36} />
      </div>
      <Link href={href} rel="nofollow noopener noreferrer" className="text-xl font-medium text-background-300 dark:text-neutral-600">
        {text}
      </Link>
    </div>
  );
}
