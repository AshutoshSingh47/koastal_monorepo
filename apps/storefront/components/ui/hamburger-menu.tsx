"use client";

import {
  Collapsible,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { NAVBAR_MENU_ITEMS } from "@/data/navbar";
import { ChevronDown, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function HamburgerMenu() {
  const [open, setIsOpen] = useState(false);

  return (
    <Drawer direction="right" onOpenChange={setIsOpen} open={open}>
      <DrawerTrigger asChild>
        <button type="button" className="flex self-start md:hidden cursor-pointer px-4 py-1">
          <MenuIcon />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle className="flex justify-end px-2 py-8">
            <X
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:text-red-600 transition-transform hover:rotate-90 ease-out duration-300 cursor-pointer"
            />
          </DrawerTitle>
        </DrawerHeader>
        <ul className="h-full p-4">
          {NAVBAR_MENU_ITEMS.map((navItem, index) =>
            navItem.innerContent ? (
              <li className="relative flex cursor-pointer flex-col mt-6" key={index}>
                <Collapsible>
                  <Link
                    className="text-xl font-medium relative gap-4 hover:text-[#3139fb] w-fit"
                    href={navItem.path}
                    onClick={() => setIsOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                  <CollapsibleTrigger asChild>
                    <button className="cursor-pointer absolute top-1 ml-3">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </CollapsibleTrigger>

                  {/* <CollapsiblePanel className="w-full mx-auto mt-2 mb-1 p-2 bg-accent">
                    <ul className="w-full">
                      {navItem.innerContent.map((subItem) => (
                        <li className="mt-2 text-lg hover:text-[#3139fb]" key={subItem.path}>
                          {subItem.name}
                        </li>
                      ))}
                    </ul>
                  </CollapsiblePanel> */}
                </Collapsible>
              </li>
            ) : (
              <li key={index} className="mt-6">
                <Link
                  className="text-xl font-medium flex items-center gap-4 hover:text-[#3139fb] w-fit"
                  href={navItem.path}
                  onClick={() => setIsOpen(false)}
                >
                  {navItem.name}
                </Link>
              </li>
            )
          )}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
