//File: frontend/components/home/FeaturesList.tsx

"use client";

import Link from "next/link";
import { TicketPercent, Truck, ShieldCheck, ArrowLeftRight } from "lucide-react";

type Feature = {
    title: string;
    icon: typeof TicketPercent;
    url?: string;
};

const features: Feature[] = [
    {
        title: "Ofertas exclusivas",
        icon: TicketPercent,
        url: "/ofertas"
    },
    {
        title: "Envíos a todo el país",
        icon: Truck,
        url: "/hc/proceso-de-compra"
    },
    {
        title: "Pago 100% seguro",
        icon: ShieldCheck,
        url: "/hc/preguntas-frecuentes"
    },
    {
        title: "Cambios y devoluciones",
        icon: ArrowLeftRight,
        url: "/hc/garantias-y-devoluciones"
    },
];

export default function MinimalFeatures() {
    return (
        <section className="bg-foreground py-6 md:py-10 border-b border-border ">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature) => {

                        const Content = (
                            <div
                                className="group relative flex flex-row  gap-1 md:gap-4 p-2 h-full bg-background cursor-pointer transition-all duration-300  hover:-translate-y-0.5 overflow-hidden items-center justify-center border border-border hover:border-primary"
                                aria-label={feature.title}
                            >
                                {/* Icono a la izquierda */}
                                <div className="shrink-0">
                                    <feature.icon className="w-3 h-3 md:w-6 md:h-6 text-primary" />
                                </div>

                                {/* Contenido de texto */}
                                <div className="relative z-10 flex flex-col">
                                    <h3 className="text-[10px] md:text-sm  text-foreground leading-snug tracking-tight">
                                        {feature.title}
                                    </h3>

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