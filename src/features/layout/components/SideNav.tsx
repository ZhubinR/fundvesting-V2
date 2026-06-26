"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "../constants";

export function SideNav({ isExpanded }: { isExpanded: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn("transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-16")}>
      <ul className="p-2 m-0 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-2 rounded-lg transition-all duration-300 ease-in-out",
                  isActive
                    ? "group-hover:bg-primary-500 dark:group-hover:bg-primary-500/50 text-white dark:text-darkBackground-500"
                    : "text-background-200 dark:text-darkBackground-500 hover:bg-primary-500/10 hover:text-primary-500",
                )}
                title={item.label}
              >
                <Icon color="currentColor" />
                <span
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "opacity-100 min-w-64 translate-x-0" : "opacity-0 translate-x-[3.5rem]",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
