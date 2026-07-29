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
        subtitle: "Equipos garantizados",
        imageSrc: "/features/original.png",
    },
    {
        title: "Envío Gratis",
        subtitle: "Desde S/ 49",
        imageSrc: "/features/envio-gratis.png",
    },
    {
        title: "A todo el Perú",
        subtitle: "Envíos nacionales",
        imageSrc: "/features/envio-a-todo-el-peru.png",
    },
    {
        title: "Pago Seguro",
        subtitle: "Todos los métodos",
        imageSrc: "/payments/culqi.png",
    },
    {
        title: "Garantía de 1 año",
        subtitle: "Compra protegida",
        imageSrc: "/features/garantia.png",
    },
];

export default function FeaturesList() {
    return (
        <div className="max-w-7xl mx-auto select-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2">
                {features.map((feature) => (
                    <div key={feature.title} className="h-full">
                        <div
                            className="group flex flex-col xl:flex-row items-center justify-center gap-2 md:gap-3 p-3 md:p-3.5 h-full bg-background border border-border text-center xl:text-left hover:border-primary/40 hover:bg-accent/10 transition-colors duration-300"
                            aria-label={`${feature.title} - ${feature.subtitle}`}
                        >
                            <div className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-muted/40 rounded-full transition-transform duration-300 group-hover:scale-110">
                                <Image
                                    src={feature.imageSrc}
                                    alt={feature.title}
                                    width={32}
                                    height={32}
                                    className="w-6 h-6 md:w-7 md:h-7 object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xs md:text-sm font-bold text-foreground leading-tight tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="hidden md:block text-[10px] md:text-xs text-muted-foreground mt-0.5 font-medium leading-tight">
                                    {feature.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}