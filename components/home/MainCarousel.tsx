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

    return (
        <section className="relative w-full  overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000} // Velocidad un poco más rápida para dinamismo
                showDots
                renderDotsOutside
                dotListClass="!bottom-4" // Dots dentro del container visualmente
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-0" // Sin padding extra entre items
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full px-4 md:px-0 py-4 md:py-6">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="group relative flex flex-col md:flex-row items-center justify-between 
                                bg-[var(--store-surface)] overflow-hidden
                                 transition-all duration-500
                                h-[500px] md:h-[400px] w-full max-w-[1440px] mx-auto"
                            >
                                {/* --- SECCIÓN DE TEXTO (Izquierda en Desktop) --- */}
                                <div className="w-full md:w-[45%] h-1/2 md:h-full flex flex-col justify-center items-center md:items-start p-6 md:pl-16 md:pr-4 text-center md:text-left order-2 md:order-1 z-10">

                                    {/* Tag Superior */}
                                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-3">
                                        {product.esNuevo ? "Nuevo Lanzamiento" : product.brand?.nombre || "Destacado"}
                                    </span>

                                    {/* Título */}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--store-text)] tracking-tight leading-[1.1] mb-2 line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    {/* Precio y Animación de Descuento */}
                                    <div className="h-12 flex flex-col justify-center mb-4">
                                        <div className="flex items-baseline gap-3 justify-center md:justify-start">
                                            <span className="text-xl md:text-2xl font-semibold text-[var(--store-text)]">
                                                S/ {product.precio?.toFixed(2)}
                                            </span>
                                            {product.precioComparativo && (
                                                <span className="text-sm text-[var(--store-text-muted)] line-through">
                                                    S/ {product.precioComparativo.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mensaje Rotativo */}
                                        {discountPercentage > 0 && (
                                            <div className="relative h-8 w-full overflow-hidden ">
                                                <p className={`absolute w-full transition-all duration-700 ease-in-out text-xs font-semibold text-[var(--store-primary)]
                                                    ${showDiscount ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                                                    Ahorra un {discountPercentage}% hoy
                                                </p>
                                                <p className={`absolute w-full transition-all duration-700 ease-in-out text-xs font-medium text-[var(--store-text-muted)]
                                                    ${!showDiscount ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                                    Oferta por tiempo limitado
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón CTA (Call To Action) */}
                                    <div className="flex items-center text-[var(--store-primary)] text-sm font-medium group/btn cursor-pointer">
                                        Comprar ahora
                                        <ChevronRight size={16} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                                    </div>
                                </div>

                                {/* --- SECCIÓN DE IMAGEN (Derecha en Desktop) --- */}
                                <div className="w-full md:w-[55%] h-1/2 md:h-full relative order-1 md:order-2 bg-[var(--store-bg)] md:bg-transparent">
                                    <div className="relative w-full h-full p-6 md:p-8">
                                        <Image
                                            src={product.imagenes?.[0] || "/placeholder.png"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                            className="object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
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