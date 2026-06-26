"use client";

import { cn } from "@/shared/lib/utils";
import { TIME_FRAME_OPTIONS } from "../constants";
import type { TimeFrameDays } from "../types";

export function TimeFrameTabs({
  value,
  onChange,
}: {
  value: TimeFrameDays | null;
  onChange: (timeFrame: TimeFrameDays) => void;
}) {
  return (
    <div className="flex justify-center h-14 items-center gap-1 md:gap-4 p-2 w-full bg-background-500 dark:bg-neutral-200 rounded-md shadow-md">
      {TIME_FRAME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "px-[16px] py-[8px] text-[12px] md:text-[13px] font-medium rounded-[4px] w-1/4 border-2",
            value === option.value
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-transparent dark:bg-neutral-300 dark:text-neutral-400 text-white border-transparent",
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
