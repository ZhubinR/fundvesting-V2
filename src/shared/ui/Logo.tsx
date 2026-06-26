import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/logos/logoSingle.png"
        width={72}
        height={72}
        quality={100}
        alt="fundvesting logo"
        className="group-hover:w-full group-hover:h-full w-[48px] h-[48px] transition-all"
      />
    </Link>
  );
}
