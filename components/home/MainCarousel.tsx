"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet:  { breakpoint: { max: 1024, min: 768 },  items: 1 },
    mobile:  { breakpoint: { max: 768,  min: 0 },    items: 1 },
};

const darkSlide = {
    wrapper:  "bg-[var(--color-bg-inverse)]",
    heading:  "text-[var(--color-text-inverse)]",
    muted:    "text-[var(--color-text-inverse)]/40",
    price:    "text-[var(--color-text-inverse)]",
    divider:  "bg-[var(--color-text-inverse)]/10",
};

const lightSlide = {
    wrapper:  "bg-[var(--color-bg-secondary)]",
    heading:  "text-[var(--color-text-primary)]",
    muted:    "text-[var(--color-text-tertiary)]",
    price:    "text-[var(--color-text-primary)]",
    divider:  "bg-[var(--color-border-subtle)]",
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="w-full overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                autoPlaySpeed={5500}
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
                {products.map((product, index) => {
                    const imageUrl    = product.imagenes?.[0] || "/logo.svg";
                    const t           = index % 2 === 0 ? darkSlide : lightSlide;
                    const hasDiscount = product.precioComparativo && product.precioComparativo > (product.precio ?? 0);
                    const discount    = hasDiscount
                        ? Math.round(((product.precioComparativo! - product.precio!) / product.precioComparativo!) * 100)
                        : null;

                    return (
                        <div key={product._id} className="w-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className={`relative flex items-center justify-center w-full min-h-[360px] md:min-h-[460px] lg:min-h-[520px] group outline-none overflow-hidden ${t.wrapper}`}
                            >
                                {/* Glow central */}
                                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,rgba(249,115,22,0.12)_0%,transparent_70%)]" />

                                {/* ── GRID 3 COLUMNAS ── */}
                                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-[1fr_1.6fr_1fr] items-center gap-6 md:gap-0 py-10 md:py-0">

                                    {/* COL 1 — Texto */}
                                    <div className="flex flex-col gap-3 order-2 md:order-1 text-center md:text-left md:pr-6">

                                        {product.brand?.nombre && (
                                            <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${t.muted}`}>
                                                {product.brand.nombre}
                                            </span>
                                        )}

                                        <h2 className={`font-semibold leading-tight tracking-tighter text-[clamp(1.4rem,3vw,2.4rem)] line-clamp-3 ${t.heading}`}>
                                            {product.nombre}
                                        </h2>

                                        {/* Precio */}
                                        <div className="flex items-end justify-center md:justify-start gap-3 flex-wrap mt-1">
                                            <div className="flex items-start gap-0.5 leading-none">
                                                <span className={`text-xs font-semibold mt-1.5 ${t.muted}`}>S/</span>
                                                <span className={`font-semibold tracking-tighter text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none ${t.price}`}>
                                                    {product.precio?.toFixed(2)}
                                                </span>
                                            </div>

                                            {hasDiscount && (
                                                <div className="flex flex-col items-start gap-0.5 mb-1">
                                                    <span className={`text-xs line-through ${t.muted}`}>
                                                        S/ {product.precioComparativo?.toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] font-black px-1.5 py-[3px] rounded-sm bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] tracking-wider">
                                                        −{discount}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className={`inline-flex items-center gap-1.5 mt-1 mx-auto md:mx-0 w-fit text-[0.7rem] font-black uppercase tracking-[0.16em] transition-colors duration-200 group-hover:text-[var(--color-accent-warm)] ${t.muted}`}>
                                            <span>Ver producto</span>
                                            <svg
                                                width="11" height="11" viewBox="0 0 11 11"
                                                fill="none" stroke="currentColor" strokeWidth="2.3"
                                                strokeLinecap="round" strokeLinejoin="round"
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            >
                                                <path d="M1.5 5.5h8M5.5 1.5l4 4-4 4" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* COL 2 — Imagen (máximo tamaño) */}
                                    <div className="relative order-1 md:order-2 w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[500px] flex items-center justify-center">
                                        {/* Halo detrás del producto */}
                                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_52%,rgba(249,115,22,0.13)_0%,transparent_65%)]" />

                                        <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04] drop-shadow-2xl">
                                            <Image
                                                src={imageUrl}
                                                alt={product.nombre || "Producto"}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 90vw, 50vw"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {/* COL 3 — Promo */}
                                    <div className="hidden md:flex flex-col items-end gap-3 order-3 md:pl-6">
                                        {hasDiscount ? (
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${t.muted}`}>
                                                    Oferta especial
                                                </span>
                                                <p className="font-black leading-none tracking-tighter| text-[clamp(1.4rem,2.4vw,2rem)] text-[var(--color-accent-warm)] border px-2 py-1 rounded-4xl border-[var(--color-accent-warm-light)]">
                                                    PRECIO
                                                </p>
                                                <p className={`font-black leading-none tracking-tighter rounded-4xl border px-3 py-1 border-[var(--color-accent-warm)] text-[clamp(1.4rem,2.4vw,2rem)] ${t.heading}`}>
                                                    INCREÍBLE
                                                </p>
                                            </div>
                                        ) : (
                                            <span className={`text-[9px] font-black uppercase tracking-[0.28em] ${t.muted}`}>
                                                Nuevo
                                            </span>
                                        )}

                                        
                                    </div>
                                </div>

                                {/* Línea inferior */}
                                <div className={`absolute bottom-0 left-0 right-0 h-px pointer-events-none ${t.divider}`} />
                            </Link>
                        </div>
                    );
                })}
            </Carousel>
        </section>
    );
}