// components/home/FeaturesList.tsx
"use client";

import Link from "next/link";
import { Zap, Globe, Lock, RefreshCw } from "lucide-react";

type Feature = {
    title: string;
    icon: typeof Zap;
    url?: string;
};

const features: Feature[] = [
    {
        title: "Envío gratis desde S/ 49",
        icon: Zap,
        url: "/ofertas"
    },
    {
        title: "Envíos a todo el país",
        icon: Globe,
        url: "/hc/proceso-de-compra"
    },
    {
        title: "Pago 100% seguro",
        icon: Lock,
        url: "/hc/preguntas-frecuentes"
    },
    {
        title: "Cambios y devoluciones",
        icon: RefreshCw,
        url: "/hc/garantias-y-devoluciones"
    },
];

export default function FeaturesList() {
    return (
        <section className="bg-background py-4 border-y border-border select-none">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {features.map((feature) => {
                        const Content = (
                            <div
                                className="group flex items-center justify-center gap-2.5 md:gap-3 p-3 h-full bg-background border border-border rounded-lg transition-all duration-200 hover:border-action-cta hover:shadow-sm"
                                aria-label={feature.title}
                            >
                                <div className="shrink-0 p-1.5 rounded-md bg-muted text-foreground group-hover:bg-action-cta group-hover:text-action-cta-foreground transition-all duration-200">
                                    <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                                </div>
                                <h3 className="text-xs md:text-sm font-medium text-foreground group-hover:text-action-cta transition-colors leading-tight">
                                    {feature.title}
                                </h3>
                            </div>
                        );

                        return (
                            <div key={feature.title} className="h-full">
                                {feature.url ? (
                                    <Link href={feature.url} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
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