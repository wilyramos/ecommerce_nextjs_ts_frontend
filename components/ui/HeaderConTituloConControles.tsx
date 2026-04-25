"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";
import HeaderConControles from "./HeaderConControles";

interface Props extends ButtonGroupProps {
    title: React.ReactNode;
    viewAllHref?: string;
    label?: string; // Ej: "Novedades", "Explorar"
}

export default function HeaderConTituloConControles({ title, next, previous, viewAllHref, label }: Props) {
    return (
        <div className="w-full flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
                
                {/* Título y Label */}
                <div className="flex flex-col">
                    {label && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-0.5">
                            {label}
                        </span>
                    )}
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        {title}
                    </h2>
                </div>

                {/* Controles y Link */}
                <div className="flex items-center gap-4">
                    {viewAllHref && (
                        <Link 
                            href={viewAllHref} 
                            className="hidden md:flex items-center gap-1 text-sm text-[var(--color-action-tertiary)] hover:opacity-70 transition-opacity"
                        >
                            Ver todo
                            <ChevronRight size={12} strokeWidth={3} />
                        </Link>
                    )}
                    <HeaderConControles next={next} previous={previous} />
                </div>
            </div>

            {/* Link para Mobile (solo si existe) */}
            {viewAllHref && (
                <Link 
                    href={viewAllHref} 
                    className="md:hidden text-sm text-[var(--color-action-tertiary)] flex items-center gap-1"
                >
                    Ver todo <ChevronRight size={10} strokeWidth={3} />
                </Link>
            )}
        </div>
    );
}