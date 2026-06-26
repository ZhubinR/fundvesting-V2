"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, TimerIcon } from "@/shared/ui/icons";
import { toJalaliSlashString } from "@/shared/lib/jalali";
import { toPersianDigits } from "@/shared/lib/persian-digits";

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function TimeDate() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Avoids a server/client markup mismatch: the clock has no meaningful
  // value until mounted in the browser.
  if (!now) return null;

  return (
    <div className="items-center gap-4 hidden md:flex">
      <div className="flex justify-center gap-[6px] font-medium text-background-400 dark:text-darkBackground-500">
        <CalendarIcon color="currentColor" />
        <div className="text-[14px] flex items-center justify-center lg:text-lg">
          {toPersianDigits(toJalaliSlashString(now))}
        </div>
      </div>
      <div className="flex gap-[6px] justify-center font-medium text-background-400 dark:text-darkBackground-500">
        <TimerIcon color="currentColor" />
        <div className="text-[14px] flex items-center justify-center lg:text-lg">
          {toPersianDigits(formatTime(now))}
        </div>
      </div>
    </div>
  );
}
