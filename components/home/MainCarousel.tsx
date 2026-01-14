"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { Sparkle, Tag } from "lucide-react";
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
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full mx-auto bg-white overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                showDots
                renderDotsOutside
                dotListClass="flex justify-center"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-2 md:px-4"
            >
                {products.map((product) => {
                    // Cálculo del porcentaje de descuento
                    const discountPercentage = product.precioComparativo
                        ? Math.round(
                            ((product.precioComparativo - product.precio) /
                                product.precioComparativo) * 100
                        )
                        : 0;

                    return (
                        <Link
                            key={product._id}
                            href={`/productos/${product.slug}`}
                            className="group relative flex flex-col md:flex-row items-center justify-between 
                        px-4 md:px-20 py-5 h-auto md:h-[360px] w-full transition-all duration-300"
                        >
                            {/* Text Section */}
                            <article className="z-10 w-full md:w-1/3 space-y-3 sm:space-y-2 text-center md:text-left order-2 md:order-1">

                                {/* Etiqueta de Marca / Nuevo con animación Hover */}
                                <div className="w-fit mx-auto md:mx-0 flex items-center gap-1.5 px-3 py-1 bg-white border text-[10px]  transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
                                    {product.esNuevo ? (
                                        // Animación: Pulso + Spin lento
                                        <Sparkle className="w-3 h-3 text-blue-600 animate-[pulse_2s_ease-in-out_infinite]" />
                                    ) : (
                                        <Tag className="w-3 h-3 text-neutral-500" />
                                    )}
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-800">
                                        {product.brand?.nombre || "TECNOLOGÍA"}
                                    </span>
                                </div>

                                {/* Título con transición de color */}
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-black leading-tight transition-colors duration-300 group-hover:text-gray-800">
                                    {product.nombre}
                                </h2>

                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center md:justify-start gap-2 sm:gap-3">
                                    {/* Precio con escala suave */}
                                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 transition-transform duration-300 origin-left group-hover:scale-105">
                                        <span className="text-xs font-semibold">S/.</span> {product.precio?.toFixed(2) ?? "0.00"}
                                    </p>

                                    {product.precioComparativo && product.precioComparativo > product.precio && (
                                        <div className="flex flex-col justify-end sm:pb-1 items-center sm:items-start">

                                            {/* Descuento Dinámico en Loop (Aparece/Desaparece) */}
                                            <div className="relative h-8 w-42 overflow-hidden bg-yellow-300  flex items-center justify-center mb-0.5  group-hover:bg-yellow-200 transition-colors">
                                                <span
                                                    className={`absolute w-full text-center text-[10px] sm:text-xs font-semibold text-gray-800 transition-all duration-500 ease-in-out transform
                                                    ${showDiscount ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
                                                >
                                                    -{discountPercentage}% OFF
                                                </span>
                                                <span
                                                    className={`absolute w-full text-center text-xs font-semibold text-gray-600 transition-all duration-500 ease-in-out transform
                                                    ${!showDiscount ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                                                >
                                                    Ahorras S/. {(product.precioComparativo - product.precio).toFixed(2)}
                                                </span>
                                            </div>

                                            <span className="text-xs sm:text-sm text-neutral-400 line-through decoration-neutral-400">
                                                S/. {product.precioComparativo.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </article>

                            {/* Image Section - Transiciones mejoradas */}
                            <div className="relative w-full md:w-2/3 h-[260px] sm:h-[300px] md:h-[350px] order-1 md:order-2">
                                <div className="relative w-full h-full perspective-1000">
                                    <Image
                                        src={product.imagenes?.[0] || "/logoapp.png"}
                                        alt={product.nombre}
                                        fill
                                        priority
                                        className="object-contain transition-all duration-700 ease-in-out transform group-hover:scale-110 group-hover:opacity-0 group-hover:rotate-3"
                                    />
                                    {product.imagenes?.[1] && (
                                        <Image
                                            src={product.imagenes[1]}
                                            alt={`${product.nombre} alternate view`}
                                            fill
                                            className="absolute inset-0 object-contain transition-all duration-700 ease-in-out transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105 group-hover:rotate-3"
                                        />
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </Carousel>
        </section>
    );
}