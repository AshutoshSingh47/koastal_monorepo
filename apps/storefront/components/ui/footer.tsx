import { FOOTER } from "@/data/footer";
import { NAVBAR_MENU_ITEMS } from "@/data/navbar";
import { SOCIALLINKS } from "@/data/social-links";
import Link from "next/link";

export function Footer() {
  return (
    <section className="w-full py-8 footer-background">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center gap-10 sm:gap-28 my-8 px-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">ABOUT INFORMATION</h1>
          <ul>
            {FOOTER.map((item) => (
              <li key={item.name} className="flex items-center mt-3.5 gap-2.5">
                <item.logo strokeWidth="2" className="w-4 h-4 text-zinc-700" />
                {item.path ? (
                  <Link
                    href={item.path}
                    className="inline text-zinc-700 text-sm font-medium hover:text-[#3139fb] hover:underline"
                  >
                    {item.description}
                  </Link>
                ) : (
                  <span className="inline text-zinc-700 text-sm font-medium">
                    {item.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-semibold">QUICK LINKS</h1>
          <ul>
            {NAVBAR_MENU_ITEMS.map((item) => (
              <li key={item.name} className="mt-3">
                <Link
                  href={item.path}
                  className="text-zinc-700 text-sm font-medium hover:text-[#3139fb] hover:underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-t-zinc-400">
        <div className="flex justify-center gap-3 py-4">
          {SOCIALLINKS.map((socialLink) => (
            <Link
              key={socialLink.name}
              href={socialLink.link}
              target="_blank"
              rel="noreferrer"
              aria-label={socialLink.name}
              className="facebook w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center group hover:bg-blue-500 transition-colors"
            >
              <socialLink.logo className="text-zinc-800 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
        <p className="mt-2 text-center text-sm text-zinc-700 font-medium">© Copyright 2025 KoastalIndiaPvt.Ltd.</p>
      </div>
    </section>
  );
}
