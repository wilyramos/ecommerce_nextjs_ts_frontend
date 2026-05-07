// File: src/components/banner/CarouselArrow.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowProps {
    onClick?: () => void;
    direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
    const base =
        "absolute top-1/2 -translate-y-1/2 z-20 bg-[#0a0a0a]/60 text-white  backdrop-blur-md hover:bg-[#FF521A] hover:text-white hover:border-transparent shadow-2xl transition-all duration-300 p-2 md:p-3 cursor-pointer group hidden sm:flex items-center justify-center";

    const position =
        direction === "left"
            ? "left-0 rounded-r-4xl"
            : "right-0 rounded-l-4xl";

    return (
        <button
            onClick={onClick}
            className={`${base} ${position}`}
            aria-label={direction === "left" ? "Anterior" : "Siguiente"}
        >
            {direction === "left" ? (
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
        </button>
    );
}