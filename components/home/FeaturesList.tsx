//File: frontend/components/home/FeaturesList.tsx

"use client";

import Link from "next/link";
import { TicketPercent, Truck, ShieldCheck, ArrowLeftRight } from "lucide-react";

type Feature = {
    title: string;
    description: string;
    icon: typeof TicketPercent;
    url?: string;
};

const features: Feature[] = [
    {
        title: "Ofertas exclusivas",
        description: "Precios especiales para ti",
        icon: TicketPercent,
        url: "/ofertas"
    },
    {
        title: "Envíos rápidos",
        description: "A todo el país en tiempo récord",
        icon: Truck,
        url: "/hc/proceso-de-compra"
    },
    {
        title: "Pago 100% seguro",
        description: "Tus datos están protegidos",
        icon: ShieldCheck,
        url: "/hc/preguntas-frecuentes"
    },
    {
        title: "Cambios y devoluciones",
        description: "Garantía de satisfacción total",
        icon: ArrowLeftRight,
        url: "/hc/garantias-y-devoluciones"
    },
];

export default function MinimalFeatures() {
    return (
        <section className="bg-background-secondary py-12 md:py-16 border-b border-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature) => {

                        const Content = (
                            <div
                                className="group relative flex flex-row items-center gap-1 md:gap-4 p-2 h-full border border-border bg-background cursor-pointer transition-all duration-300 hover:border-border-hover hover:-translate-y-0.5 overflow-hidden"
                                aria-label={feature.title}
                            >
                                {/* Icono a la izquierda */}
                                <div className="shrink-0">
                                    <feature.icon className="w-3 h-3 md:w-6 md:h-6 text-primary" />
                                </div>

                                {/* Contenido de texto */}
                                <div className="relative z-10 flex flex-col">
                                    <h3 className="text-[10px] md:text-sm font-semibold text-foreground leading-snug tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className=" text-[8px] md:text-xs text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                        return (
                            <div key={feature.title} className="h-full">
                                {feature.url ? (
                                    <Link href={feature.url} className="block group/link outline-none">
                                        {Content}
                                    </Link>
                                ) : (
                                    Content
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}