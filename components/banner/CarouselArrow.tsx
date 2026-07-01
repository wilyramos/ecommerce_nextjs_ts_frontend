"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowProps {
    onClick?: () => void;
    direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
    const position =
        direction === "left"
            ? "left-0 rounded-r-full"
            : "right-0 rounded-l-full";

    return (
        <button
            onClick={onClick}
            aria-label={direction === "left" ? "Anterior" : "Siguiente"}
            className={`
                absolute top-1/2 -translate-y-1/2 z-20
                hidden sm:flex items-center justify-center
                w-12 h-14
                bg-white/10 dark:bg-black/10
                text-black dark:text-white
                backdrop-blur-md
                border border-black/15 dark:border-white/15
                hover:bg-black hover:dark:bg-white
                hover:text-white hover:dark:text-black
                transition-all duration-200 cursor-pointer
                ${position}
            `}
        >
            {direction === "left" ? (
                <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
            ) : (
                <ChevronRight className="w-6 h-6 stroke-[1.5]" />
            )}
        </button>
    );
}