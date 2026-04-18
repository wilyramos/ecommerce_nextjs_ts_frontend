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
                                className="flex flex-col md:flex-row w-full group"
                            >
                                {/* TEXTO */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-20 py-6 md:py-0 space-y-2 md:space-y-3 order-2 md:order-1">
                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                                        {product.brand?.nombre || "Exclusivo"}
                                    </span>

                                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-[var(--color-text-primary)] leading-tight line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-4 md:gap-6 pt-1 md:pt-2">
                                        <span className="text-lg sm:text-xl md:text-3xl font-black text-[var(--color-action-primary)]">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>

                                        <div className="flex items-center gap-1 md:gap-2 text-xs sm:text-sm font-bold group-hover:text-[var(--color-action-primary)] transition-colors">
                                            Comprar
                                            <ArrowRight
                                                size={16}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGEN */}
                                <div className="w-full md:w-1/2 relative bg-white flex items-center justify-center order-1 md:order-2 overflow-hidden">
                                    {/* Gradientes */}
                                    <div className="hidden md:block absolute inset-y-0 left-0 w-24 lg:w-32 z-20 pointer-events-none bg-gradient-to-r from-[var(--color-bg-secondary)] to-transparent" />
                                    <div className="md:hidden absolute inset-x-0 top-0 h-12 z-20 pointer-events-none bg-gradient-to-b from-[var(--color-bg-secondary)] to-transparent" />

                                    {/* CONTENEDOR RESPONSIVE REAL */}
                                    <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square md:aspect-[4/3] z-10 transition-transform duration-500 group-hover:scale-105">
                                        <Image
                                            src={imageUrl}
                                            alt={product.nombre || "Producto"}
                                            fill
                                            className="object-contain"
                                            sizes="
                        (max-width: 640px) 90vw,
                        (max-width: 768px) 80vw,
                        (max-width: 1024px) 50vw,
                        40vw
                      "
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