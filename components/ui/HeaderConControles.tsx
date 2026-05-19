"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

export default function HeaderConControles({ next, previous }: ButtonGroupProps) {
    return (
        <div className="flex gap-1.5">
            {/* Botón Anterior */}
            <button
                onClick={() => previous?.()}
                className="
                    group
                    p-2
                    rounded-full
                    bg-background
                    border border-border
                    text-muted-foreground
                    hover:border-action-cta
                    hover:text-action-cta
                    transition-all duration-300
                    active:scale-90
                    outline-none
                "
                aria-label="Anterior"
            >
                <ChevronLeft 
                    className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" 
                    strokeWidth={2.5} 
                />
            </button>

            {/* Botón Siguiente */}
            <button
                onClick={() => next?.()}
                className="
                    group
                    p-2
                    rounded-full
                    bg-background
                    border border-border
                    text-muted-foreground
                    hover:border-action-cta
                    hover:text-action-cta
                    transition-all duration-300
                    active:scale-90
                    outline-none
                "
                aria-label="Siguiente"
            >
                <ChevronRight 
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                    strokeWidth={2.5} 
                />
            </button>
        </div>
    );
}