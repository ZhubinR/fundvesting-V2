import Image from "next/image";
import { ContactItem } from "@/features/contact/components/ContactItem";

const CONTACT_METHODS = [
  { icon: "/images/gmail.svg", text: "برای ما ایمیل ارسال کنید", href: "mailto:fundvestinginfo@gmail.com" },
  { icon: "/images/telegram.svg", text: "در تلگرام پیام دهید", href: "https://t.me/FundvestingAdmin" },
  { icon: "/images/telegram.svg", text: "کانال تلگرام ما", href: "https://t.me/fundvesting" },
  { icon: "/images/telegram.svg", text: "ربات تلگرام ما", href: "https://t.me/Fundvestingdatabot" },
  { icon: "/images/whatsapp.svg", text: "در واتساپ پیام دهید", href: "https://wa.me/989380398277" },
];

export default function ContactPage() {
  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-center mb-24 container mx-auto">
      <div className="flex items-center justify-center">
        <Image
          src="/images/contact.webp"
          width={600}
          height={600}
          alt="contact picture"
          className="object-cover object-center border border-[#ffffff73] rounded-[48px] overflow-hidden"
        />
      </div>
      <div>
        <div className="flex items-center justify-center gap-3 mb-9">
          <h2 className="w-fit min-w-48 text-2xl text-background-100 dark:text-neutral-800 font-bold">
            راه های ارتباطی ما
          </h2>
          <span className="w-[90%] h-[3px] rounded-md bg-primary-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTACT_METHODS.map((method) => (
            <ContactItem key={method.href} {...method} />
          ))}
        </div>
      </div>
    </section>
  );
}
