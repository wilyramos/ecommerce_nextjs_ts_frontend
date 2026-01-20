"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

export default function HeaderConControles({ next, previous }: ButtonGroupProps) {
    return (
        <div className="flex gap-3">
            <button
                onClick={() => previous?.()}
                className="
                    p-2.5
                    rounded-full
                    bg-[var(--store-surface-hover)]
                    text-[var(--store-text-muted)]
                    hover:text-[var(--store-text)]
                    transition-all duration-300
                    active:scale-90
                "
                aria-label="Anterior"
            >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>

            <button
                onClick={() => next?.()}
                className="
                    p-2.5
                    rounded-full
                    bg-[var(--store-surface-hover)]
                    text-[var(--store-text-muted)]
                    hover:text-[var(--store-text)]
                    transition-all duration-300
                    active:scale-90
                "
                aria-label="Siguiente"
            >
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
        </div>
    );
}