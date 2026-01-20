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
        icon: TicketPercent
    },
    {
        title: "Envíos rápidos",
        description: "A todo el país en tiempo récord",
        icon: Truck
    },
    {
        title: "Pago 100% seguro",
        description: "Tus datos están protegidos",
        icon: ShieldCheck
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
        <section className="bg-white py-12 md:py-16 border-b border-[var(--store-border)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {features.map((feature) => {
                        const Content = (
                            <div
                                className="group flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300"
                                aria-label={feature.title}
                            >
                                <div className="mb-4 p-3 rounded-2xl bg-[var(--store-bg)] text-[var(--store-text)] group-hover:bg-[var(--store-primary)] group-hover:text-white transition-all duration-500">
                                    <feature.icon
                                        size={26}
                                        strokeWidth={1.5}
                                    />
                                </div>

                                <h3 className="text-sm md:text-base font-bold text-[var(--store-text)] tracking-tight mb-1">
                                    {feature.title}
                                </h3>

                                <p className="text-xs text-[var(--store-text-muted)] leading-relaxed max-w-[200px]">
                                    {feature.description}
                                </p>
                            </div>
                        );

                        return (
                            <div key={feature.title} className="h-full">
                                {feature.url ? (
                                    <Link href={feature.url} className="block group cursor-pointer">
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