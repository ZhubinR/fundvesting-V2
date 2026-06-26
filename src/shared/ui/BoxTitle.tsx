export function BoxTitle({ titleText, textSize }: { titleText: string; textSize: string }) {
  return (
    <div className="flex gap-3 items-center">
      <span className="w-[3px] h-6 bg-secondary-500 rounded-full hidden md:block" />
      <p className={`font-semibold text-white dark:text-black text-[${textSize}]`}>{titleText}</p>
    </div>
  );
}
