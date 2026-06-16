// File: src/components/banner/CarouselArrow.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowProps {
    onClick?: () => void;
    direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
    const position =
        direction === "left"
            ? "left-0 rounded-r-4xl"
            : "right-0 rounded-l-4xl";

    return (
        <button
            onClick={onClick}
            aria-label={direction === "left" ? "Anterior" : "Siguiente"}
            className={`
                absolute top-1/2 -translate-y-1/2 z-20
                hidden sm:flex items-center justify-center
                w-12 h-12
                bg-zinc-500/15
                text-zinc-500
                backdrop-blur-xs
                hover:bg-zinc-500/25
                hover:text-zinc-700
                transition-all duration-200 cursor-pointer
                ${position}
            `}
        >
            {direction === "left" ? (
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
            ) : (
                <ChevronRight className="w-5 h-5 stroke-[2]" />
            )}
        </button>
    );
}