"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function NavBarClient({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 30) {
        setIsScrolled(false);
        setIsVisible(true);
      } else {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY && currentScrollY > 140) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        id="smart-navbar"
        data-scrolled={isScrolled}
        className={cn(
          "group fixed inset-x-0 top-0 z-[1000] w-full transition-all duration-normal ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isScrolled
            ? "border-b border-border-primary/60 bg-surface-primary/85 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-surface-primary"
        )}
      >
        {children}
      </header>

      {/* Espaciador reservado: 56px en móvil, 130px en desktop */}
      <div className="h-14 w-full shrink-0 md:h-[130px]" aria-hidden="true" />
    </>
  );
}