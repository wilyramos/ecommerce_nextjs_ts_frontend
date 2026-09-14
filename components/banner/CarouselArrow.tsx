// components/home/CarouselArrow.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowProps {
  onClick?: () => void;
  direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Anterior banner" : "Siguiente banner"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary/20 bg-surface-primary/40 text-text-primary shadow-sm backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:bg-surface-primary/80 hover:shadow-md active:scale-95 md:opacity-0 md:group-hover:opacity-100 ${
        isLeft ? "left-3 sm:left-6" : "right-3 sm:right-6"
      }`}
    >
      {isLeft ? (
        <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
      ) : (
        <ChevronRight className="h-5 w-5 stroke-[1.5]" />
      )}
    </button>
  );
}