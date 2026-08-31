// File: frontend/components/home/FeaturesList.tsx

"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { P, Small, BadgeText } from "@/components/ui/TypographyStore";

type Feature = {
    title: ReactNode;
    subtitle?: string;
    imageSrc?: string;
};

const features: Feature[] = [
    {
        title: "100% Originales",
        imageSrc: "/features/original.png",
    },
    {
        title: (
            <>
                Envío <BadgeText className="font-semibold text-foreground">GRATIS*</BadgeText>
            </>
        ),
        imageSrc: "/features/envio-gratis.png",
    },
    {
        title: "Envíos a todo el Perú",
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
    {
        title: "Delivery inmediato",
        subtitle: "A todo Cañete",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-screen-2xl mx-auto px-2 select-none">
            <div className="grid grid-cols-2 xs:grid-cols-3 md:flex md:flex-wrap justify-center gap-1.5 sm:gap-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-2 bg-background transition-colors min-w-0"
                    >
                        {feature.imageSrc && (
                            <div className="shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-muted/20 border border-border rounded-full">
                                <Image
                                    src={feature.imageSrc}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="w-3.5 h-3.5 sm:w-5 sm:h-5 object-contain"
                                    unoptimized
                                />
                            </div>
                        )}

                        <div className="flex flex-col min-w-0">
                            <P className="text-[11px] sm:text-xs font-medium leading-tight truncate">
                                {feature.title}
                            </P>
                            {feature.subtitle && (
                                <Small className="text-[10px] sm:text-xs mt-0.5 truncate">
                                    {feature.subtitle}
                                </Small>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}