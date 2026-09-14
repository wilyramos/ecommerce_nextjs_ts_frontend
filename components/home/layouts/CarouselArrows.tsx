// File: frontend/components/home/layouts/CarouselArrows.tsx
"use client";

import { ArrowProps } from "react-multi-carousel";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export const CustomLeftArrow = ({ onClick }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute left-1 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-radius-full border border-border-primary/60 bg-surface-primary/80 text-text-secondary backdrop-blur-md shadow-xs transition-all duration-fast hover:bg-surface-primary hover:text-text-primary active:scale-95"
    aria-label="Anterior"
  >
    <HiChevronLeft className="size-4" />
  </button>
);

export const CustomRightArrow = ({ onClick }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-1 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-radius-full border border-border-primary/60 bg-surface-primary/80 text-text-secondary backdrop-blur-md shadow-xs transition-all duration-fast hover:bg-surface-primary hover:text-text-primary active:scale-95"
    aria-label="Siguiente"
  >
    <HiChevronRight className="size-4" />
  </button>
);