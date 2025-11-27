"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

export default function HeaderConControles({ next, previous }: ButtonGroupProps) {
    return (
        <div className="flex items-start justify-end mb-10 md:mb-12 pr-1">
            <div className="flex gap-3">
                <button
                    onClick={() => previous?.()}
                    className="
                        p-1 rounded-full 
                        border  
                        hover:bg-black hover:border-black 
                        shadow-sm
                        group transition-all duration-300
                    "
                    aria-label="Anterior"
                >
                    <ArrowLeft
                        className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors"
                        strokeWidth={1.3}
                    />
                </button>

                <button
                    onClick={() => next?.()}
                    className="
                        p-1 rounded-full 
                        border  
                        hover:bg-black hover:border-black 
                         
                        group transition-all duration-300
                    "
                    aria-label="Siguiente"
                >
                    <ArrowRight
                        className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors"
                        strokeWidth={1.3}
                    />
                </button>
            </div>
        </div>
    );
}
