import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

export function Byline() {
  return (
    <div className="flex items-center text-sm gap-0 sm:gap-16 justify-evenly sm:justify-center py-2.5 bg-(--byline-background) text-[#333333] w-full">
      <Link
        href={"tel:0120-4143233"}
        target="_blank"
        className="flex gap-2 items-center"
      >
        <PhoneCall className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-medium">0120-4143233</span>
      </Link>
      <Link
        href={"mailto:koastalindia@gmail.com"}
        target="_blank"
        className="hidden min-[350px]:flex gap-2 items-center"
      >
        <Mail className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-medium">koastalindia@gmail.com</span>
      </Link>
    </div>
  );
}
