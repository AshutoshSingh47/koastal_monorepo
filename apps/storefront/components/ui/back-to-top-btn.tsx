"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 50 ? true : false);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleBackToTop}
      aria-label="Back to top"
      className={cn(
        "group fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#3139fb] shadow-lg transition-all duration-300 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3139fb]",
        show
          ? "cursor-pointer opacity-100 translate-y-0"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ChevronUp className="h-6 w-6 text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5" />
    </button>
  );
}
