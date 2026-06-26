import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/fundRavand", label: "روند صندوق ها" },
  { href: "/fundBar", label: "جامع صندوق ها" },
  { href: "/compare", label: "مقایسه" },
  { href: "/suggest", label: "پیشنهاد" },
];

export function FooterNav() {
  return (
    <nav className="md:ml-11">
      <ul className="p-0 m-0 flex lg:gap-9 gap-4 justify-center md:justify-start text-background-300 dark:text-background-500">
        {FOOTER_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="lg:text-[15px] text-[12px] font-medium hover:text-primary-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
