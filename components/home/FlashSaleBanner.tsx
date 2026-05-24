"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Estilo de botón estandarizado (puedes moverlo a tu archivo de componentes si prefieres)
const ActionButton = () => (
    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-action-cta uppercase tracking-wider group-hover:gap-4 transition-all">
        Ver detalles <ArrowRight size={16} />
    </div>
);

export default function HeroFlashSale() {
    return (
        <Link href="/ofertas" className="group flex flex-col justify-center p-8 bg-background-secondary border border-border transition-all hover:border-action-cta min-h-[360px]">
            <div className="space-y-4">
                <div className="text-action-cta font-bold text-xs uppercase tracking-widest">Oferta Relámpago</div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                    Precios fugaces, <br />
                    <span className="text-muted">oportunidades únicas.</span>
                </h2>
                <ActionButton />
            </div>
        </Link>
    );
}
