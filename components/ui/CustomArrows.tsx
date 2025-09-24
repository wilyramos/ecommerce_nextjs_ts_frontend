"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ArrowProps = {
    onClick?: () => void;
    direction: "left" | "right";
};

export function CustomArrow({ onClick, direction }: ArrowProps) {
    const baseClasses =
        "absolute top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-black hover:text-white shadow-md transition p-3";

    const positionClasses =
        direction === "left"
            ? "left-0 rounded-r-full"
            : "right-0 rounded-l-full";

    return (
        <button onClick={onClick} className={`${baseClasses} ${positionClasses}`}>
            {direction === "left" ? (
                <ChevronLeft className="w-6 h-6" />
            ) : (
                <ChevronRight className="w-6 h-6" />
            )}
        </button>
    );
}
