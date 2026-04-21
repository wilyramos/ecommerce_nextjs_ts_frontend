"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import { ArrowRight } from "lucide-react";
import type { ProductResponse } from "@/src/schemas";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function MainCarousel({
    products,
}: {
    products: ProductResponse[];
}) {
    if (!products?.length) return null;

    return (
        <section className="w-full bg-[var(--color-bg-secondary)] overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                showDots
                renderDotsOutside={false}
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                containerClass="w-full"
                itemClass="w-full"
                dotListClass="!bottom-2 md:!bottom-4"
            >
                {products.map((product) => {
                    const imageUrl = product.imagenes?.[0] || "/logo.svg";

                    return (
                        <div key={product._id} className="w-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="flex flex-col md:flex-row w-full group outline-none"
                            >
                                {/* TEXTO - Padding vertical y espaciado reducidos */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-4 md:py-8 space-y-2 md:space-y-3 order-2 md:order-1">
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                                        {product.brand?.nombre || "Exclusivo"}
                                    </span>

                                    {/* Tamaños de texto ajustados a la nueva proporción */}
                                    <h2 className="max-w-md text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] leading-[1.1] tracking-tight line-clamp-2 transition-colors group-hover:text-[var(--color-text-secondary)]">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-4 pt-1">
                                        <span className="text-lg md:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>

                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-all">
                                            <span className="hidden sm:inline">Explorar ahora</span>
                                            <ArrowRight
                                                size={16}
                                                strokeWidth={2.5}
                                                className="transition-transform group-hover:translate-x-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGEN - Altura mínima reducida proporcionalmente */}
                                <div className="w-full md:w-1/2 relative bg-white flex items-center justify-center order-1 md:order-2 overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-[300px]">
                                    <div className="hidden md:block absolute inset-y-0 left-0 w-24 z-20 pointer-events-none bg-gradient-to-r from-[var(--color-bg-secondary)] to-transparent" />
                                    <div className="md:hidden absolute inset-x-0 top-0 h-12 z-20 pointer-events-none bg-gradient-to-b from-[var(--color-bg-secondary)] to-transparent" />

                                    {/* Max-width ajustado para evitar desbordamientos en el contenedor más bajo */}
                                    <div className="relative w-full max-w-[160px] sm:max-w-[200px] md:max-w-xs lg:max-w-sm aspect-square z-10 transition-transform duration-700 group-hover:scale-110">
                                        <Image
                                            src={imageUrl}
                                            alt={product.nombre || "Producto"}
                                            fill
                                            className="object-contain p-2"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Carousel>
        </section>
    );
}