"use client";

import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarIcon } from "@/shared/ui/icons";
import { jalaliToGregorianSlashString } from "@/shared/lib/jalali";

export function DateField({
  label,
  onDateChange,
}: {
  label: string;
  onDateChange: (gregorianSlashDate: string | null) => void;
}) {
  const [value, setValue] = useState<DateObject | null>(null);

  return (
    <div className="flex flex-col items-start md:w-1/2 w-full h-14 rounded-md">
      <div className="w-full justify-between h-14 text-left shadow-md rounded-md font-normal text-white dark:text-neutral-500 bg-background-500 dark:bg-neutral-200 flex items-center px-3">
        <span>{label}</span>
        <DatePicker
          value={value}
          placeholder="تاریخ"
          onChange={(newDate) => {
            const next = Array.isArray(newDate) ? newDate[0] ?? null : newDate;
            setValue(next);
            onDateChange(jalaliToGregorianSlashString(next));
          }}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          inputClass="w-full h-full text-white dark:text-neutral-500 bg-background-500 dark:bg-neutral-200 focus-visible:outline-none border-b border-background-600 dark:border-neutral-300"
        />
        <CalendarIcon color="currentColor" className="mr-2 h-4 w-4" />
      </div>
    </div>
  );
}
