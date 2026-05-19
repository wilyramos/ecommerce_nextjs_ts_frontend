"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroNewArrivals() {
    return (
        <Link 
            href="/novedades" 
            className="group relative flex flex-col justify-center p-6 bg-primary min-h-[360px] overflow-hidden "
        >
            {/* Subtle depth gradient sobre fondo oscuro */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"/>

            <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 text-action-cta font-semibold text-xs uppercase tracking-tight">
                    Recién llegado
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground leading-[1.1]">
                    Lo último en <br />
                    <span className="text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300">
                        tecnología.
                    </span>
                </h2>

                <p className="text-primary-foreground/70 max-w-xs text-sm leading-relaxed">
                    Explora la nueva generación de dispositivos diseñados para el futuro.
                </p>

                <div className="flex items-center gap-2 text-action-cta font-medium pt-4 group-hover:gap-3 transition-all duration-300">
                    Explorar novedades <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}