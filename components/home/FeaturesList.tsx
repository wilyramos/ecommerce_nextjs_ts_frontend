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
        subtitle: "Toda la ciudad de Cañete",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-screen-2xl mx-auto px-2 select-none">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-background transition-colors"
                    >
                        {feature.imageSrc && (
                            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted/20 border border-border">
                                {feature.imageSrc && (
                                    <Image
                                        src={feature.imageSrc}
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 object-contain"
                                        unoptimized
                                    />
                                )}
                            </div>
                        )}

                        <div className="flex flex-col min-w-0">
                            <P className="text-xs font-medium leading-tight truncate">
                                {feature.title}
                            </P>
                            {feature.subtitle && (
                                <Small className="mt-0.5 truncate">
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