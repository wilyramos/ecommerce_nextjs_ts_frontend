"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

export default function HeaderConControles({ next, previous }: ButtonGroupProps) {
    return (
        <div className="flex justify-end mb-10 md:mb-12">
            <div className="flex gap-1.5">
                <button
                    onClick={() => previous?.()}
                    className="
            p-2
            rounded-full
            text-neutral-500
            hover:text-black
            hover:bg-neutral-100
            transition-all duration-200
          "
                    aria-label="Anterior"
                >
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <button
                    onClick={() => next?.()}
                    className="
            p-2
            rounded-full
            text-neutral-500
            hover:text-black
            hover:bg-neutral-100
            transition-all duration-200
          "
                    aria-label="Siguiente"
                >
                    <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
