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
        subtitle: "Prodctos oficiales",
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
        <div className="max-w-7xl mx-auto select-none px-2 sm:px-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                {features.map((feature, index) => {
                    const isLastOddItem =
                        index === features.length - 1 && features.length % 2 !== 0;

                    return (
                        <div
                            key={feature.title}
                            className={`h-full ${isLastOddItem ? "col-span-2 sm:col-span-1" : "col-span-1"
                                }`}
                        >
                            <div
                                className="group flex flex-col xl:flex-row items-center justify-center gap-2 md:gap-3 p-2.5 sm:p-3 h-full bg-background border border-border text-center xl:text-left hover:border-border-hover hover:bg-muted-neutral transition-colors duration-200 rounded-md"
                                aria-label={`${feature.title} - ${feature.subtitle}`}
                            >
                                <div className="shrink-0 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-muted/30 rounded-full transition-transform duration-200 group-hover:scale-105">
                                    <Image
                                        src={feature.imageSrc}
                                        alt={feature.title}
                                        width={26}
                                        height={26}
                                        className="w-6 h-6 md:w-7 md:h-7 object-contain"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-xs font-semibold text-foreground leading-snug tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 font-normal leading-tight">
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