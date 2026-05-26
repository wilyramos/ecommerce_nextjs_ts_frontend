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
                w-10 h-10
                border border-white/10
                bg-white/5 dark:bg-black/20
                text-white/70
                backdrop-blur-md
                hover:bg-white hover:text-black
                transition-all duration-200
                ${position}
            `}
        >
            {direction === "left" ? (
                <ChevronLeft className="w-4 h-4" />
            ) : (
                <ChevronRight className="w-4 h-4" />
            )}
        </button>
    );
}