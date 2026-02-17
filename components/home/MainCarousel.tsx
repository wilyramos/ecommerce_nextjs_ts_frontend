"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";
import { useEffect, useState } from "react";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    const [showDiscount, setShowDiscount] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowDiscount((prev) => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    if (!products || products.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden py-2 md:py-4">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000}
                showDots
                renderDotsOutside
                dotListClass="!bottom-0"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-2 md:px-4"
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full pb-6">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="group relative flex flex-col md:flex-row items-center justify-between 
                                bg-[var(--store-surface)]
                                min-h-[340px] md:h-[300px] w-full max-w-[1440px] mx-auto overflow-hidden rounded-lg"
                            >
                                {/* --- SECCIÓN DE TEXTO (Abajo en Móvil, Izquierda en Desktop) --- */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-4 md:pl-12 md:pr-4 text-center md:text-left order-2 md:order-1 z-10 h-[55%] md:h-full">

                                    {/* Tag Superior */}
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded-full border border-[var(--store-border)] bg-[var(--store-bg)]">
                                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--store-text-muted)]">
                                            {product.esNuevo ? "Nuevo" : product.brand?.nombre || "Destacado"}
                                        </span>
                                    </span>

                                    {/* Título - Reducido */}
                                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[var(--store-text)] tracking-tighter leading-[1.1] mb-2 line-clamp-2 md:line-clamp-3">
                                        {product.nombre}
                                    </h2>

                                    {/* Bloque de Precio */}
                                    <div className="flex flex-col justify-center items-center md:items-start mb-3 w-full">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl md:text-2xl font-semibold text-[var(--store-text)] tracking-tight">
                                                S/ {product.precio?.toFixed(2)}
                                            </span>
                                            {product.precioComparativo && (
                                                <span className="text-xs md:text-sm text-[var(--store-text-muted)] line-through decoration-[var(--store-text-muted)]">
                                                    S/ {product.precioComparativo.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mensaje Rotativo */}
                                        {discountPercentage > 0 && (
                                            <div className="relative h-4 w-full mt-0.5 overflow-hidden">
                                                <p className={`absolute w-full left-0 transition-all duration-700 ease-in-out text-[10px] md:text-xs font-semibold text-[var(--store-primary)] uppercase tracking-wider
                                                    ${showDiscount ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                                                    Ahorra un {discountPercentage}%
                                                </p>
                                                <p className={`absolute w-full left-0 transition-all duration-700 ease-in-out text-[10px] md:text-xs font-medium text-[var(--store-text-muted)] uppercase tracking-wider
                                                    ${!showDiscount ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                                    Oferta limitada
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón CTA - Más compacto */}
                                    <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[var(--store-text)] text-[var(--store-surface)] text-xs md:text-sm font-medium transition-transform duration-300 group-hover:scale-105">
                                        Ver Detalles
                                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {/* --- SECCIÓN DE IMAGEN (Arriba en Móvil, Derecha en Desktop) --- */}
                                <div className="w-full md:w-1/2 relative order-1 md:order-2 h-[45%] md:h-full p-4 md:p-8 flex items-center justify-center bg-[var(--store-bg-secondary)]/30">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={product.imagenes?.[0] || "/placeholder.png"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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