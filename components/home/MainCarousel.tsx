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
                dotListClass="!bottom-4 md:!bottom-6"
            >
                {products.map((product) => {
                    const imageUrl = product.imagenes?.[0] || "/logo.svg";

                    return (
                        <div key={product._id} className="w-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="flex flex-col md:flex-row w-full group outline-none"
                            >
                                {/* TEXTO - Optimizado para legibilidad */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-8 md:py-16 space-y-3 md:space-y-4 order-2 md:order-1">
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                                        {product.brand?.nombre || "Exclusivo"}
                                    </span>

                                    {/* Título: Menos "ancho", más definido */}
                                    <h2 className="max-w-md text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] leading-[1.1] tracking-tight line-clamp-2 transition-colors group-hover:text-[var(--color-action-primary)]">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-5 pt-2">
                                        <span className="text-xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>

                                        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-action-primary)] transition-all">
                                            <span className="hidden sm:inline">Explorar ahora</span>
                                            <ArrowRight
                                                size={18}
                                                strokeWidth={2.5}
                                                className="transition-transform group-hover:translate-x-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGEN */}
                                <div className="w-full md:w-1/2 relative bg-white flex items-center justify-center order-1 md:order-2 overflow-hidden min-h-[250px] sm:min-h-[350px] md:min-h-[450px]">
                                    {/* Gradientes de suavizado */}
                                    <div className="hidden md:block absolute inset-y-0 left-0 w-32 z-20 pointer-events-none bg-gradient-to-r from-[var(--color-bg-secondary)] to-transparent" />
                                    <div className="md:hidden absolute inset-x-0 top-0 h-16 z-20 pointer-events-none bg-gradient-to-b from-[var(--color-bg-secondary)] to-transparent" />

                                    <div className="relative w-full max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-lg aspect-square z-10 transition-transform duration-700 group-hover:scale-110">
                                        <Image
                                            src={imageUrl}
                                            alt={product.nombre || "Producto"}
                                            fill
                                            className="object-contain p-4"
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