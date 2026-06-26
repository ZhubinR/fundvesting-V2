import Link from "next/link";
import { Logo } from "@/shared/ui/Logo";
import { ContactCta } from "./ContactCta";
import { NAV_ITEMS } from "../constants";

export function MobileSideBar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside
      className={`lg:hidden z-50 transition-all min-w-80 duration-400 ease-in-out flex flex-col px-4 py-6 bg-background-800 dark:bg-darkBackground-200 rounded-l-2xl fixed ${
        isOpen ? "right-0" : "right-[-400px]"
      } top-4 bottom-4`}
    >
      <div className="flex items-center justify-between w-full">
        <Logo />
        <svg
          onClick={onClose}
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          className="cursor-pointer text-white dark:text-darkBackground-500"
        >
          <path
            fill="currentColor"
            d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"
          />
        </svg>
      </div>
      <nav className="flex-grow">
        <ul className="p-0 m-0 flex flex-col gap-4 mt-7">
          {NAV_ITEMS.map(({ href, label, mobileLabel, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className="flex items-center gap-4 text-background-200 dark:text-background-500 hover:text-primary-500 dark:hover:text-primary-300 transition-transform duration-300"
                title={mobileLabel ?? label}
              >
                <Icon color="currentColor" />
                <span>{mobileLabel ?? label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ContactCta />
    </aside>
  );
}
