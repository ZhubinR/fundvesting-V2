import jalaali from "jalaali-js";
import { toPersianDigits } from "./persian-digits";

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

/**
 * "2024-03-21" -> "۱۴۰۳-۰۱-۰۲" (used as the recharts X-axis tick formatter
 * on every trend chart). Falls back to the raw string if it isn't a
 * well-formed `YYYY-MM-DD` date, matching the old `formatToJalali`.
 */
export function formatIsoDateAsJalali(isoDate: string | undefined): string {
  if (!isoDate) return "";

  const [year, month, day] = isoDate.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    return isoDate;
  }
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return isoDate;
  }

  const jalali = jalaali.toJalaali(year, month, day);
  return `${toPersianDigits(jalali.jy)}-${toPersianDigits(jalali.jm)}-${toPersianDigits(jalali.jd)}`;
}

/**
 * Gregorian `Date` -> "1403/01/02" (used for blog/news publish dates).
 */
export function toJalaliSlashString(date: Date): string {
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}

/**
 * `{ year, month, day }` (Jalali) -> "2024/03/21" (Gregorian, ASCII digits).
 * Used to convert date-picker selections back to the format the market
 * API expects. This exact snippet was previously copy-pasted in
 * `ChartController.jsx`, `ChartcontrollerBar.jsx` and `formatToJalali.js`.
 */
export function jalaliToGregorianSlashString(jalali: JalaliDate | null): string | null {
  if (!jalali) return null;
  const { gy, gm, gd } = jalaali.toGregorian(jalali.year, jalali.month, jalali.day);
  return `${gy}/${String(gm).padStart(2, "0")}/${String(gd).padStart(2, "0")}`;
}
