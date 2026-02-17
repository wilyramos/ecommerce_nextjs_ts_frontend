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
        }, 4000); // 4 segundos para lectura tranquila
        return () => clearInterval(interval);
    }, []);

    if (!products || products.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden py-4 md:py-6">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000} // Velocidad un poco más rápida para dinamismo
                showDots
                renderDotsOutside
                dotListClass="!bottom-0" // Ajuste para que los dots se vean bien con el nuevo padding
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-4" // Padding lateral para que se vean los bordes redondeados
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full pb-8">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="group relative flex flex-col md:flex-row items-center justify-between 
                                bg-[var(--store-surface)]
                                min-h-[500px] md:h-[460px] w-full max-w-[1440px] mx-auto overflow-hidden"
                            >
                                {/* --- SECCIÓN DE TEXTO (Abajo en Móvil, Izquierda en Desktop) --- */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-8 md:pl-16 md:pr-8 text-center md:text-left order-2 md:order-1 z-10 h-1/2 md:h-full">

                                    {/* Tag Superior */}
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-[var(--store-border)] bg-[var(--store-bg)]">
                                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)]">
                                            {product.esNuevo ? "Nuevo Lanzamiento" : product.brand?.nombre || "Destacado"}
                                        </span>
                                    </span>

                                    {/* Título */}
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--store-text)] tracking-tighter leading-[1.1] mb-4 line-clamp-3">
                                        {product.nombre}
                                    </h2>

                                    {/* Bloque de Precio y Animación */}
                                    <div className="flex flex-col justify-center items-center md:items-start mb-6 w-full">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-2xl md:text-3xl font-semibold text-[var(--store-text)] tracking-tight">
                                                S/ {product.precio?.toFixed(2)}
                                            </span>
                                            {product.precioComparativo && (
                                                <span className="text-sm md:text-base text-[var(--store-text-muted)] line-through decoration-[var(--store-text-muted)]">
                                                    S/ {product.precioComparativo.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mensaje Rotativo (Con contenedor fijo para evitar saltos) */}
                                        {discountPercentage > 0 && (
                                            <div className="relative h-5 w-full mt-1 overflow-hidden">
                                                <p className={`absolute w-full left-0 transition-all duration-700 ease-in-out text-xs font-semibold text-[var(--store-primary)] uppercase tracking-wider
                                                    ${showDiscount ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                                                    Ahorra un {discountPercentage}% hoy
                                                </p>
                                                <p className={`absolute w-full left-0 transition-all duration-700 ease-in-out text-xs font-medium text-[var(--store-text-muted)] uppercase tracking-wider
                                                    ${!showDiscount ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                                    Oferta por tiempo limitado
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón CTA */}
                                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--store-text)] text-[var(--store-surface)] text-sm font-medium transition-transform duration-300 group-hover:scale-105">
                                        Ver Detalles
                                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {/* --- SECCIÓN DE IMAGEN (Arriba en Móvil, Derecha en Desktop) --- */}
                                <div className="w-full md:w-1/2 relative order-1 md:order-2 h-[250px] md:h-full p-6 md:p-12 flex items-center justify-center ">
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