"use client";

import Image from "next/image";
import { ReactNode } from "react";

// Cambiamos el tipo de title a ReactNode para permitir inyectar estilos (como colores)
type Feature = {
    title: ReactNode;
    subtitle?: string;
    imageSrc: string;
};

const features: Feature[] = [
    {
        title: "100% Originales",
        imageSrc: "/features/original.png",
    },
    {
        // Se destaca la palabra "GRATIS" con un color específico
        title: <>Envío <span className="font-extrabold tracking-wide">GRATIS*</span></>,
        imageSrc: "/features/envio-gratis.png",
    },
    {
        title: "Envios a todo el Perú",
        imageSrc: "/features/envio-a-todo-el-peru.png",
    },
    {
        title: "Yape, Plin y Tarjetas",
        imageSrc: "/payments/culqi.png",
    },
    {
        title: "Productos con Garantía",
        imageSrc: "/features/garantia.png",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-screen-2xl mx-auto px-2 select-none">
            {/* Flex wrap permite que los items fluyan sin forzar anchos en móviles */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-md bg-background transition-colors"
                    >
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-background-secondary border border-border">
                            <Image
                                src={feature.imageSrc}
                                alt=""
                                width={20}
                                height={20}
                                className="w-5 h-5 object-contain"
                                unoptimized
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-foreground leading-tight truncate">
                                {feature.title}
                            </span>
                            {feature.subtitle && (
                                <span className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                                    {feature.subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}