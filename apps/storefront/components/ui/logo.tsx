import Image from "next/image";
import LogoIcon from "@/public/koastal-logo-1.png";

export function Logo() {
  return (
    <div className="text-4xl">
      <Image src={LogoIcon} alt="Koastal" className="w-40 h-10 bg-transparent"/>
    </div>
  );
}
