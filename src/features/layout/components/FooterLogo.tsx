import Image from "next/image";

export function FooterLogo() {
  return (
    <div className="flex items-center gap-4 flex-col mb-10 md:mb-0">
      <Image src="/images/logos/footerLogo.png" alt="logo" width={284} height={80} />
    </div>
  );
}
