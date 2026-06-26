import { FooterLogo } from "./FooterLogo";
import { FooterNav } from "./FooterNav";

export function Footer() {
  return (
    <footer className="lg:ml-6 lg:mr-[94px] mx-4">
      <div className="bg-mid dark:bg-darkBackground-200 rounded-2xl flex md:flex-row flex-col items-center justify-center md:justify-between mb-[36px] lg:py-8 lg:px-5 py-6 px-3">
        <FooterLogo />
        <FooterNav />
      </div>
      <span className="mb-[36px] w-full flex items-center justify-center text-sm text-white dark:text-darkBackground-500 font-light">
        تمامی حقوق مادی و معنوی وبسایت فاندوستینگ محفوظ است.
      </span>
    </footer>
  );
}
