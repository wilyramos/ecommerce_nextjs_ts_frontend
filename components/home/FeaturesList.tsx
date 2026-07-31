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
        title: <>Envío <span className="font-extrabold tracking-wide">GRATIS</span></>,
        subtitle: "Compras desde S/ 49",
        imageSrc: "/features/envio-gratis.png",
    },
    {
        title: "Envios a todo el Perú",
        imageSrc: "/features/envio-a-todo-el-peru.png",
    },
    {
        title: "Pago Seguro",
        subtitle: "Yape, Plin y Tarjetas",
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
                        className="group flex items-center gap-1.5 p-1 sm:p-2.5 bg-background border border-transparent hover:border-border transition-all duration-300 rounded-lg min-w-[120px] max-w-[220px] w-auto"
                        aria-label="Característica de la tienda"
                    >
                        <div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-muted/40 rounded-full transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src={feature.imageSrc}
                                alt="Icono"
                                width={36}
                                height={36}
                                className="w-9 h-9 sm:w-10 sm:h-10 object-contain opacity-90"
                                unoptimized
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-tight tracking-tight">
                                {feature.title}
                            </h3>
                            {feature.subtitle && (
                                <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                                    {feature.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}