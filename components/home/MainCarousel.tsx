"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-white">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={5500}
                showDots
                renderDotsOutside={false}
                dotListClass="!bottom-4 z-50"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                // Altura más compacta
                containerClass="w-full h-[380px] md:h-[420px] lg:h-[450px]"
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)
                        : 0;

                    return (
                        <div key={product._id} className="w-full h-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="relative flex flex-col md:flex-row items-center justify-center w-full h-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24"
                            >
                                {/* --- SECCIÓN DE TEXTO --- */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1">
                                    <div className="flex items-center gap-2 mb-1 md:mb-3">
                                        <span className="px-2 py-0.5 bg-black text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            {product.brand?.nombre || "Exclusivo"}
                                        </span>
                                        {product.esNuevo && (
                                            <span className="flex items-center gap-1 text-black text-[10px] font-bold uppercase">
                                                <Tag size={12} /> Nuevo
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight mb-2 md:mb-4 line-clamp-2">
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                                        <span className="text-xl md:text-2xl font-black text-black">
                                            S/ {product.precio?.toFixed(2)}
                                        </span>
                                        {product.precioComparativo && (
                                            <span className="text-xs md:text-base text-gray-400 line-through font-medium">
                                                S/ {product.precioComparativo.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all hover:bg-gray-800 shadow-md">
                                        Ver Producto
                                        <ArrowRight size={14} />
                                    </div>
                                </div>

                                {/* --- SECCIÓN DE IMAGEN (MÁS GRANDE) --- */}
                                <div className="w-full md:w-1/2 h-44 md:h-full relative flex items-center justify-center z-10 order-1 md:order-2">
                                    {/* Resplandor de fondo */}
                                    <div className="absolute inset-0 w-[80%] h-[80%] m-auto" />

                                    {/* Contenedor de imagen optimizado para mayor tamaño */}
                                    <div className="relative w-full h-full max-w-[300px] md:max-w-none md:h-[90%] lg:h-[95%]">
                                        <Image
                                            src={product.imagenes?.[0] || "/logo.svg"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 70vw, 50vw"
                                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    {discountPercentage > 0 && (
                                        <div className="absolute top-2 right-2 md:top-8 md:right-4 bg-red-500 text-white w-10 h-10 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transform rotate-12 z-20">
                                            <span className="text-xs md:text-sm">-{discountPercentage}%</span>
                                            <span className="text-[7px] md:text-[8px] uppercase">Off</span>
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