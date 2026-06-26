"use client";

import { useState } from "react";
import { Logo } from "@/shared/ui/Logo";
import { cn } from "@/shared/lib/utils";
import { SideNav } from "./SideNav";
import { ContactCta } from "./ContactCta";

export function SideBar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "hidden z-50 group items-center justify-between lg:flex lg:flex-col px-4 py-6 dark:bg-darkBackground-200 bg-background-800 shadow-2xl rounded-l-2xl fixed right-0 top-4 bottom-4",
          "transition-all duration-300 ease-in-out",
          isHovered ? "w-64 bg-mid shadow-[#ffffff52]" : "w-20",
        )}
      >
        <Logo />
        <SideNav isExpanded={isHovered} />
        <ContactCta />
      </aside>
      {isHovered && (
        <div className="fixed inset-0 bg-[#0000007d] backdrop-blur-sm z-20 transition-opacity duration-300 ease-in-out" />
      )}
    </>
  );
}
