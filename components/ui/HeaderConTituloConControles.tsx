"use client";

import type { ButtonGroupProps } from "react-multi-carousel";
import HeaderConControles from "./HeaderConControles";

interface Props extends ButtonGroupProps {
    title: string;
    subtitle?: string;
}

export default function HeaderConTituloConControles({ title, subtitle, next, previous }: Props) {
    return (
        <div className="flex items-end justify-between mb-8 md:mb-10">
            <div className="space-y-1">
                {subtitle && (
                    <p className="text-[var(--store-primary)] text-xs font-semibold uppercase tracking-[0.1em]">
                        {subtitle}
                    </p>
                )}
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--store-text)]">
                    {title}
                </h2>
            </div>

            <HeaderConControles next={next} previous={previous} />
        </div>
    );
}