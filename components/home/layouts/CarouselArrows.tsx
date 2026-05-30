// File: frontend/components/home/layouts/CarouselArrows.tsx
"use client";

import { ArrowProps } from "react-multi-carousel";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export const CustomLeftArrow = ({ onClick }: ArrowProps) => (
    <button
        onClick={onClick}
        className="absolute -left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        aria-label="Anterior"
    >
        <HiChevronLeft className="w-5 h-5" />
    </button>
);

export const CustomRightArrow = ({ onClick }: ArrowProps) => (
    <button
        onClick={onClick}
        className="absolute -right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        aria-label="Siguiente"
    >
        <HiChevronRight className="w-5 h-5" />
    </button>
);