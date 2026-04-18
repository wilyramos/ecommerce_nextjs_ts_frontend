"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";
import { ArrowRight } from "lucide-react";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-[var(--color-bg-secondary)] py-2 sm:py-4">
            {/* Overlay Hover Sutil */}
            <div className="absolute inset-0 bg-[var(--color-text-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                showDots
                renderDotsOutside={false}
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                // ALTURA REDUCIDA AQUÍ
                containerClass="w-full h-[300px] sm:h-[350px] lg:h-[420px]"
            >
                {products.map((product) => (
                    <div key={product._id} className="w-full h-full">
                        <Link
                            href={`/productos/${product.slug}`}
                            className="relative flex flex-col md:flex-row items-center justify-between w-full h-full px-6 md:px-16 lg:px-32 group"
                        >
                            {/* TEXTO COMPACTO */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1 mt-2 md:mt-0 space-y-2 sm:space-y-4">

                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)]">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                                        {product.brand?.nombre || "Destacado"}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-[var(--color-text-primary)]">
                                        {product.nombre}
                                    </h2>
                                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm max-w-xs font-medium opacity-80 line-clamp-2">
                                        La última innovación tecnológica disponible hoy.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">Desde</span>
                                        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--color-action-primary)]">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-action-primary)] transition-colors pt-3">
                                        Comprar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>

                            {/* IMAGEN COMPACTA */}
                            <div className="w-full md:w-1/2 relative flex items-center justify-center z-10 order-1 md:order-2">
                                <div className="absolute w-32 h-32 sm:w-56 sm:h-56 bg-[var(--color-action-primary)] opacity-5 blur-[40px] rounded-full" />

                                {/* ALTURA DE IMAGEN AJUSTADA */}
                                <div className="relative w-full h-[150px] sm:h-[250px] md:h-[300px] lg:h-[350px] transition-all duration-700 ease-out group-hover:scale-105">
                                    <Image
                                        src={product.imagenes?.[0] || "/logo.svg"}
                                        alt={product.nombre}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 80vw, 40vw"
                                        className="object-contain animate-float"
                                    />
                                </div>
                            </div>

                        </Link>
                    </div>
                ))}
            </Carousel>

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
                .react-multi-carousel-dot-list {
                    bottom: 15px !important;
                }
            `}</style>
        </section>
    );
}