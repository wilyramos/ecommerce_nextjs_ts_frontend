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
    tablet:  { breakpoint: { max: 1024, min: 768 },  items: 1 },
    mobile:  { breakpoint: { max: 768,  min: 0 },    items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="w-full overflow-hidden bg-[var(--color-bg-secondary)]">
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
                dotListClass="!bottom-3 md:!bottom-5"
            >
                {products.map((product) => {
                    const imageUrl = product.imagenes?.[0] || "/logo.svg";
                    const hasDiscount = product.precioComparativo && product.precioComparativo > (product.precio ?? 0);
                    const discount = hasDiscount
                        ? Math.round(((product.precioComparativo! - product.precio!) / product.precioComparativo!) * 100)
                        : null;

                    return (
                        <div key={product._id} className="w-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="flex flex-col md:flex-row w-full group outline-none"
                            >
                                {/* ── TEXTO ── */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-6 md:py-10 space-y-4 order-2 md:order-1">

                                    {/* Marca */}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                                        {product.brand?.nombre || "Exclusivo"}
                                    </span>

                                    {/* Nombre */}
                                    <h2 className="max-w-md text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--color-text-primary)] leading-[1.1] tracking-tight line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    {/* Precio */}
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">S/</span>
                                            <span className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                                                {product.precio?.toFixed(2)}
                                            </span>
                                        </div>

                                        {hasDiscount && (
                                            <>
                                                <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                                                    S/ {product.precioComparativo?.toFixed(2)}
                                                </span>
                                                <span className="text-[11px] font-semibold px-2 py-0.5 bg-[var(--color-accent-warm-light)] text-[var(--color-accent-warm)]">
                                                    −{discount}%
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-warm)] transition-colors w-fit pt-1">
                                        <span>Ver producto</span>
                                        <ArrowRight
                                            size={15}
                                            strokeWidth={2}
                                            className="transition-transform group-hover:translate-x-1.5"
                                        />
                                    </div>
                                </div>

                                {/* ── IMAGEN ── */}
                                <div className="w-full md:w-1/2 relative flex items-center justify-center order-1 md:order-2 overflow-hidden min-h-[200px] sm:min-h-[240px] md:min-h-[320px] bg-transparent">

                                    {/* Gradiente lateral desktop */}
                                    <div className="hidden md:block absolute inset-y-0 left-0 w-20 z-20 pointer-events-none bg-gradient-to-r from-[var(--color-bg-secondary)] to-transparent" />
                                    {/* Gradiente superior mobile */}
                                    <div className="md:hidden absolute inset-x-0 bottom-0 h-10 z-20 pointer-events-none bg-gradient-to-t from-[var(--color-bg-secondary)] to-transparent" />

                                    <div className="relative w-full max-w-[160px] sm:max-w-[210px] md:max-w-xs lg:max-w-sm aspect-square z-10 transition-transform duration-700 ease-out group-hover:scale-105">
                                        <Image
                                            src={imageUrl}
                                            alt={product.nombre || "Producto"}
                                            fill
                                            className="object-contain drop-shadow-sm"
                                            sizes="(max-width: 768px) 60vw, 40vw"
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