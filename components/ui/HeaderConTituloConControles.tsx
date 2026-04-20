"use client";

import type { ButtonGroupProps } from "react-multi-carousel";
import HeaderConControles from "./HeaderConControles";

interface Props extends ButtonGroupProps {
    title: string;
}

export default function HeaderConTituloConControles({ title, next, previous }: Props) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl tracking-tighter text-[var(--color-text-secondary)] whitespace-nowrap font-semibold">
                {title}
            </h2>

            <HeaderConControles next={next} previous={previous} />
        </div>
    );
}