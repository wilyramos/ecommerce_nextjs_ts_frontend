"use client";

import Link from "next/link";
import {
    RiShieldCheckLine,
    RiTruckLine,
    RiMapPin2Line,
    RiBankCardLine,
    RiRefund2Line,
} from "react-icons/ri";

type Feature = {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    url?: string;
};

const features: Feature[] = [
    {
        title: "Equipos 100% Originales",
        icon: RiShieldCheckLine,
        url: "/hc/garantias",
    },
    {
        title: "Envío Gratis desde S/ 49",
        icon: RiTruckLine,
        url: "/ofertas",
    },
    {
        title: "Envíos a todo el Perú",
        icon: RiMapPin2Line,
        url: "/hc/proceso-de-compra",
    },
    {
        title: "Todos los métodos de pago",
        icon: RiBankCardLine,
        url: "/hc/preguntas-frecuentes",
    },
    {
        title: "Garantía de 1 año",
        icon: RiRefund2Line,
        url: "/hc/garantias-y-devoluciones",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-7xl mx-auto select-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
                {features.map((feature) => {
                    const IconComponent = feature.icon;

                    const Content = (
                        <div
                            className="group flex items-center  justify-center gap-2.5 md:gap-3 p-3.5 h-full bg-background border border-border"
                            aria-label={feature.title}
                        >
                            <div className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:scale-110">
                                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-xs md:text-sm text-muted-foreground leading-tight">
                                {feature.title}
                            </h3>
                        </div>
                    );

                    return (
                        <div key={feature.title} className="h-full">
                            {feature.url ? (
                                <Link
                                    href={feature.url}
                                    className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
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
    );
}