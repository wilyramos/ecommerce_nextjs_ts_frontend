"use client";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

interface ArrowProps {
    onClick?: () => void;
    direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
    const baseClasses =
        "absolute top-1/2 -translate-y-1/2 flex items-center justify-center " +
        "w-12 h-12 rounded-full shadow-xs bg-white/70 backdrop-blur " +
        "hover:bg-gray-100 cursor-pointer transition-colors duration-200 z-10";

    const position = direction === "left" ? "-left-3" : "-right-3";

    return (
        <button onClick={onClick} className={`${baseClasses} ${position}`}>
            {direction === "left" ? (
                <MdArrowBackIosNew className="text-gray-800" size={20} />
            ) : (
                <MdArrowForwardIos className="text-gray-800" size={20} />
            )}
        </button>
    );
}
