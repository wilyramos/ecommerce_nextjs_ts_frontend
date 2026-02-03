"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Usaremos este para el estilo Apple Link
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
        }, 3000); // Un poco más lento para no distraer
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full bg-[var(--store-bg)]  overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={8000}
                showDots
                renderDotsOutside
                dotListClass=""
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass=""
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="group relative flex flex-col md:flex-row items-center justify-between 
                                bg-[var(--store-surface)] px-6 md:px-20 py-10 md:py-0 h-auto md:h-[480px] w-full 
                                transition-all duration-500 "
                            >
                                {/* Sección de Texto */}
                                <article className="z-10 w-full md:w-1/2 space-y-4 text-center md:text-left order-2 md:order-1 mt-8 md:mt-0">

                                    {/* Tag Estilo Apple */}
                                    <div className="flex items-center justify-center md:justify-start">
                                        <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--store-primary)]">
                                            {product.esNuevo ? "Nuevo" : product.brand?.nombre || "Exclusivo"}
                                        </span>
                                    </div>

                                    {/* Título Principal */}
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--store-text)] leading-[1.1] line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    {/* Precio y Descuento */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <p className="text-xl md:text-2xl font-medium text-[var(--store-text)]">
                                                S/. {product.precio?.toFixed(2)}
                                            </p>

                                            {product.precioComparativo && (
                                                <span className="text-sm text-[var(--store-text-muted)] line-through">
                                                    S/. {product.precioComparativo.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Badge de Ahorro Elegante */}
                                        {discountPercentage > 0 && (
                                            <div className="h-6 relative overflow-hidden flex items-center justify-center md:justify-start">
                                                <span className={`absolute transition-all duration-700 ease-in-out text-sm font-medium text-[var(--store-primary)]
                                                    ${showDiscount ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                                                    Ahorra un {discountPercentage}% hoy
                                                </span>
                                                <span className={`absolute transition-all duration-700 ease-in-out text-sm font-medium text-[var(--store-text-muted)]
                                                    ${!showDiscount ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                                    Oportunidad limitada
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones de Acción Estilo Apple */}
                                    <div className="flex items-center justify-center md:justify-start gap-6 pt-4">

                                        <div className="flex items-center text-[var(--store-primary)] font-medium hover:underline cursor-pointer group/link text-sm">
                                            Más información <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>

                                {/* Sección de Imagen */}
                                <div className="relative w-full md:w-1/2 h-[280px] sm:h-[350px] md:h-[400px] order-1 md:order-2">
                                    <div className="relative w-full h-full p-4">
                                        <Image
                                            src={product.imagenes?.[0] || "/logoapp.png"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         50vw"
                                            className="object-contain transition-all duration-1000 ease-in-out group-hover:scale-105"
                                        />


                                        {/* Efecto de segunda imagen al hover (suave) */}
                                        {product.imagenes?.[1] && (
                                            <Image
                                                src={product.imagenes[1]}
                                                alt={product.nombre}
                                                fill
                                                sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 50vw,
           50vw"
                                                className="absolute inset-0 object-contain transition-all duration-1000 ease-in-out
               opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-105"
                                            />
                                        )}

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