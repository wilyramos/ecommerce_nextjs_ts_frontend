"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full bg-white border-b border-gray-100">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000}
                showDots
                renderDotsOutside={false}
                dotListClass="!bottom-4 z-50 scale-90"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                // Altura reducida sustancialmente
                containerClass="w-full h-[420px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full h-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="relative flex flex-col md:flex-row items-center justify-between w-full h-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-0 group"
                            >
                                {/* TEXTO: Tamaños ajustados para menor altura */}
                                <div className="w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1 mt-4 md:mt-0">
                                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                                        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.15em] text-[#86868b]">
                                            {product.brand?.nombre || "Premium"}
                                        </span>
                                        {product.esNuevo && (
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-[#bf4800]">
                                                Nuevo
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight mb-4 text-[#1d1d1f] line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-lg md:text-xl font-medium text-[#1d1d1f]">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>
                                        {product.precioComparativo && (
                                            <span className="text-sm text-[#86868b] line-through decoration-1">
                                                S/ {product.precioComparativo.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 md:gap-6">

                                        <div className="flex items-center gap-0.5 text-[#0071e3] text-[13px] font-medium hover:underline group/link">
                                            Detalles
                                            <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGEN: Contenedor más compacto */}
                                <div className="w-full md:w-[50%] h-[180px] sm:h-[220px] md:h-full relative flex items-center justify-center z-10 order-1 md:order-2">
                                    <div className="relative w-full h-full max-h-[160px] sm:max-h-[220px] md:max-h-[320px] lg:max-h-[360px] transition-transform duration-500 group-hover:scale-[1.03]">
                                        <Image
                                            src={product.imagenes?.[0] || "/logo.svg"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Badge de Descuento Mini */}
                                    {discountPercentage > 0 && (
                                        <div className="absolute -top-2 -right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm border border-black/5 w-11 h-11 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center shadow-lg z-20">
                                            <span className="text-[10px] md:text-xs font-bold text-[#1d1d1f]">-{discountPercentage}%</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Carousel>
        </section>
    );
}