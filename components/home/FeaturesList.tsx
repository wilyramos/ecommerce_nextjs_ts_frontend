"use client";

import Image from "next/image";

type Feature = {
    title: string;
    subtitle: string;
    imageSrc: string;
};

const features: Feature[] = [
    {
        title: "100% Originales",
        subtitle: "Productos oficiales",
        imageSrc: "/features/original.png",
    },
    {
        title: "Envío Gratis",
        subtitle: "Compras desde S/ 49",
        imageSrc: "/features/envio-gratis.png",
    },
    {
        title: "Todo el Perú",
        subtitle: "Cobertura nacional",
        imageSrc: "/features/envio-a-todo-el-peru.png",
    },
    {
        title: "Pago Seguro",
        subtitle: "Tarjetas, Yape y Plin",
        imageSrc: "/payments/culqi.png",
    },
    {
        title: "Con Garantía",
        subtitle: "Productos con respaldo",
        imageSrc: "/features/garantia.png",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-7xl mx-auto select-none px-1 sm:px-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 md:gap-3">
                {features.map((feature, index) => {
                    const isLastOddItem =
                        index === features.length - 1 && features.length % 2 !== 0;

                    return (
                        <div
                            key={feature.title}
                            className={`h-full ${
                                isLastOddItem ? "col-span-2 sm:col-span-1" : "col-span-1"
                            }`}
                        >
                            <div
                                className="group flex flex-col xl:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 p-1 sm:p-2 md:p-3 h-full bg-background border border-border text-center xl:text-left hover:border-border-hover hover:bg-muted-neutral transition-colors duration-200 rounded-md"
                                aria-label={`${feature.title} - ${feature.subtitle}`}
                            >
                                <div className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 bg-muted/30 rounded-full transition-transform duration-200 group-hover:scale-105">
                                    <Image
                                        src={feature.imageSrc}
                                        alt={feature.title}
                                        width={40}
                                        height={40}
                                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 object-contain"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0 font-normal leading-none">
                                        {feature.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}