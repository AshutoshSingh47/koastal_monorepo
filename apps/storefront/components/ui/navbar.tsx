"use client";
import { Card, CardContent } from "@workspace/ui/components/card";
import { NAVBAR_MENU_ITEMS } from "@/data/navbar";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "./logo";
import { useEffect, useState } from "react";
import { HamburgerMenu } from "./hamburger-menu";
import { TextRoll } from "@/components/ui/skiper58";
import { cn } from "@workspace/ui/lib/utils";

export function Navbar() {
  const fallbackImage = "/koastal-logo-1.png";
  const [image, setImage] = useState(
    () => NAVBAR_MENU_ITEMS[0]?.innerContent?.[0]?.image || fallbackImage
  );
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const previewImage = image || fallbackImage;

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex w-full items-center justify-between border-b border-transparent bg-white py-4 transition-all duration-200",
        isSticky && "border-zinc-200 shadow-sm"
      )}
    >
      <div className="flex gap-16 items-center w-[1680px] mx-auto px-4">
        <Logo />
        <ul className="hidden gap-6 items-center text-sm mb-1.5 md:flex">
          {NAVBAR_MENU_ITEMS.map((navItem) =>
            navItem.innerContent ? (
              <li key={navItem.name} className="relative group">
                <div className="flex items-center gap-1">
                  <Link href={navItem.path}>
                    <TextRoll className="group/link font-medium transition-colors hover:text-[#3139fb] group-[.card]:hover:text-current">
                      {navItem.name}
                    </TextRoll>
                  </Link>
                  <ChevronDown className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-180" />
                </div>

                {navItem.innerContent && (
                  <Card className="absolute top-full -left-1/2 mt-2.5 w-auto py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-md z-50 rounded-lg group/card">
                    <CardContent className="p-1 flex">
                      <ul className="flex flex-col gap-1">
                        {navItem.innerContent.map((subItem) => (
                          <li
                            onMouseLeave={() =>
                              setImage(
                                navItem.innerContent?.[0]?.image || fallbackImage
                              )
                            }
                            onMouseOver={() =>
                              setImage(subItem.image || fallbackImage)
                            }
                            key={subItem.name}
                            className="px-4 py-1 hover:bg-transparent hover:text-[#3139fb]"
                          >
                            <Link href={subItem.path}>{subItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                      <div className="relative w-80 h-64">
                        <Image
                          fill
                          className="rounded-sm object-cover"
                          sizes="320px"
                          alt="Product preview"
                          src={previewImage}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </li>
            ) : (
              <li
                key={navItem.name}
                className="hover:text-[#3139fb] font-medium"
              >
                <Link href={navItem.path}>
                  <TextRoll>{navItem.name}</TextRoll>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
      <HamburgerMenu />
    </nav>
  );
}
