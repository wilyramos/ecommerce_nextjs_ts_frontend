"use client";

import type { ButtonGroupProps } from "react-multi-carousel";
import HeaderConControles from "./HeaderConControles";

interface Props extends ButtonGroupProps {
    title: string;
    subtitle?: string;
}

export default function HeaderConTituloConControles({ title, subtitle, next, previous }: Props) {
    return (
        <div className="flex items-start justify-between mb-10 md:mb-12">
            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-neutral-500 text-sm uppercase tracking-wider">
                        {subtitle}
                    </p>
                )}
            </div>

            <HeaderConControles next={next} previous={previous} />
        </div>
    );
}
