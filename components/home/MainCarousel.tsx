"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

// Configuración responsive más precisa
const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full bg-white border-b border-gray-100 overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000}
                showDots
                renderDotsOutside={false}
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                // Ajuste de altura responsiva: de pequeño a grande
                containerClass="w-full h-[500px] sm:h-[450px] md:h-[400px] lg:h-[500px]"
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full h-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="relative flex flex-col md:flex-row items-center justify-center md:justify-between w-full h-full group px-6 md:px-12 lg:px-20"
                            >
                                {/* TEXTO: Prioridad visual en móvil y alineación */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1 mt-6 md:mt-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                            {product.brand?.nombre || "Premium"}
                                        </span>
                                        {product.esNuevo && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#bf4800]">
                                                Nuevo
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-2xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight mb-4 text-[#1d1d1f] max-w-md md:max-w-full line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-xl md:text-2xl font-medium text-[#1d1d1f]">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>
                                        {product.precioComparativo && (
                                            <span className="text-sm md:text-base text-gray-400 line-through">
                                                S/ {product.precioComparativo.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-[#0071e3] text-sm md:text-base font-medium hover:underline group/link">
                                        Ver detalles
                                        <ChevronRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                {/* IMAGEN: Escalamiento fluido */}
                                <div className="w-full md:w-1/2 relative flex items-center justify-center z-10 order-1 md:order-2">
                                    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[380px] transition-transform duration-500 group-hover:scale-105">
                                        <Image
                                            src={product.imagenes?.[0] || "/logo.svg"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 80vw, 40vw"
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Badge de Descuento: Posicionado respecto al contenedor de la imagen */}
                                    {discountPercentage > 0 && (
                                        <div className="absolute top-0 right-[10%] md:top-4 md:right-4 bg-white/90 backdrop-blur-sm border border-black/5 w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center shadow-xl z-30">
                                            <span className="text-[10px] md:text-xs font-bold text-red-600">-{discountPercentage}%</span>
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