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
                    bg-[var(--color-bg-primary)]
                    border border-[var(--color-border-subtle)]
                    text-[var(--color-text-secondary)]
                    hover:border-[var(--color-accent-warm)]
                    hover:text-[var(--color-accent-warm)]
                    transition-all duration-300
                    active:scale-90
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
                    bg-[var(--color-bg-primary)]
                    border border-[var(--color-border-subtle)]
                    text-[var(--color-text-secondary)]
                    hover:border-[var(--color-accent-warm)]
                    hover:text-[var(--color-accent-warm)]
                    transition-all duration-300
                    active:scale-90
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