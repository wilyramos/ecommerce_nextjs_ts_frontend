"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

interface Props extends ButtonGroupProps {
    title: React.ReactNode;
    viewAllHref?: string;
    label?: string;
    isStaticGrid?: boolean; // Nueva propiedad de control
}

export default function HeaderConTituloConControles({ title, viewAllHref, label, }: Props) {
    // Si viene desde los parámetros de react-multi-carousel, tiene controles válidos

    return (
        <div className="w-full flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">

                {/* Título y Label */}
                <div className="flex flex-col">
                    {label && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
                            {label}
                        </span>
                    )}
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                        {title}
                    </h2>
                </div>

                {/* Controles y Link */}
                <div className="flex items-center gap-4">
                    {viewAllHref && (
                        <Link
                            href={viewAllHref}
                            className="flex items-center gap-1 text-xs md:text-sm text-foreground hover:text-action-cta font-medium transition-colors duration-200"
                        >
                            Ver todo
                            <ChevronRight size={12} strokeWidth={3} />
                        </Link>
                    )}


                </div>
            </div>

        </div>
    );
}