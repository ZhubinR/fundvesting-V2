const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/**
 * Converts ASCII digits in a string/number to Persian (Extended Arabic-Indic)
 * digits, e.g. `toPersianDigits(1403)` -> `"۱۴۰۳"`.
 *
 * The old codebase had three copies of this exact behaviour:
 * `convertToFarsiDigits` (formatToJalali.js, char-code arithmetic),
 * `convertToPersianDigits` (numbersHandler, lookup table) and a third,
 * unused `convertEnglishDigits` that actually produced Eastern Arabic
 * digits (٠-٩) instead of Persian ones (۰-۹) — a latent bug, never hit
 * because nothing called it. This is the one implementation going forward.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}
