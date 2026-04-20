"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroNewArrivals() {
    return (
        <Link 
            href="/novedades" 
            className="group relative flex flex-col justify-center p-10 md:p-14 bg-[var(--color-bg-inverse)] min-h-[360px] overflow-hidden"
        >
            {/* Subtle depth gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 text-[var(--color-accent-warm)] font-semibold text-xs uppercase tracking-tight">
                    Recién llegado
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text-inverse)] leading-[1.1]">
                    Lo último en <br />
                    <span className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-inverse)] transition-colors">
                        tecnología.
                    </span>
                </h2>

                <p className="text-[var(--color-text-inverse)]/70 max-w-xs text-sm leading-relaxed">
                    Explora la nueva generación de dispositivos diseñados para el futuro.
                </p>

                <div className="flex items-center gap-2 text-[var(--color-accent-warm)] font-medium pt-4 group-hover:gap-3 transition-all">
                    Explorar novedades <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}