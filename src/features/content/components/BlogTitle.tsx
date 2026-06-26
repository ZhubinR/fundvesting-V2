import { CalendarIcon } from "@/shared/ui/icons";

export function BlogTitle({ text, desc, date }: { text: string; desc?: string; date?: string }) {
  return (
    <section className="py-12 mb-16 bg-blogHero bg-cover bg-center bg-no-repeat relative rounded-2xl overflow-hidden shadow-xl">
      <h1 className="font-bold relative z-[2] w-full text-center text-white text-[32px]">{text}</h1>
      {desc && <p className="text-background-300 mb-3 text-center relative z-[2]">{desc}</p>}
      {date && (
        <div className="m-auto w-fit bg-primary-500 bg-opacity-25 border border-primary-500 flex items-center px-2 py-1 rounded-full gap-2 relative z-[2]">
          <CalendarIcon color="#77B2EE" />
          <span className="text-sm text-center text-primary-300">{date}</span>
        </div>
      )}
      <div className="w-full h-full bg-background-950 opacity-70 z-1 absolute top-0 left-0 flex" />
    </section>
  );
}
