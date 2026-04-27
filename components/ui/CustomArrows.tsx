"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ArrowProps = {
    onClick?: () => void;
    direction: "left" | "right";
};

export function CustomArrow({ onClick, direction }: ArrowProps) {
    /**
     * Ajustes realizados:
     * 1. bg-[#0a0a0a]/60: Fondo oscuro semi-transparente para contraste universal.
     * 2. backdrop-blur-md: Efecto desenfoque para estilo premium.
     * 3. border-white/10: Borde sutil para separar la flecha cuando el slide es negro.
     * 4. hover:bg-[#FF521A]: Cambio al naranja de marca en hover.
     */
    const baseClasses =
        "absolute top-1/2 -translate-y-1/2 z-20 bg-[#0a0a0a]/60 text-white border border-white/10 backdrop-blur-md hover:bg-[#FF521A] hover:text-white hover:border-transparent shadow-2xl transition-all duration-300 p-3 md:p-4 cursor-pointer group";

    const positionClasses =
        direction === "left"
            ? "left-0 rounded-r-4xl"
            : "right-0 rounded-l-4xl";

    return (
        <button 
            onClick={onClick} 
            className={`${baseClasses} ${positionClasses}`}
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