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

export default function MainCarousel({
    products,
}: {
    products: ProductResponse[];
}) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-white border-b border-gray-100">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={5500}
                showDots
                renderDotsOutside={false}
                dotListClass="!bottom-3 z-50 scale-75"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                containerClass="w-full h-[450px] sm:h-[350px] md:h-[380px] lg:h-[400px]"
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(
                            ((product.precioComparativo - product.precio) /
                                product.precioComparativo) *
                            100
                        )
                        : 0;

                    return (
                        <div key={product._id} className="w-full h-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="relative flex flex-col md:flex-row items-center justify-center w-full h-full mx-auto px-6 md:px-12 lg:px-24 gap-4 md:gap-0"
                            >
                                {/* TEXTO: Reducido a 40% para dar espacio a la imagen */}
                                <div className="w-full md:w-[40%] flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm"
                                            style={{ backgroundColor: "var(--store-text)", color: "var(--store-surface)" }}
                                        >
                                            {product.brand?.nombre || "Exclusivo"}
                                        </span>
                                        {product.esNuevo && (
                                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase" style={{ color: "var(--store-text)" }}>
                                                <Tag size={10} /> Nuevo
                                            </span>
                                        )}
                                    </div>

                                    <h2
                                        className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-3 line-clamp-1 md:line-clamp-2"
                                        style={{ color: "var(--store-text)" }}
                                    >
                                        {product.nombre}
                                    </h2>

                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-xl md:text-2xl font-bold" style={{ color: "var(--store-text)" }}>
                                            S/ {product.precio?.toFixed(2)}
                                        </span>
                                        {product.precioComparativo && (
                                            <span className="text-sm line-through opacity-50" style={{ color: "var(--store-text)" }}>
                                                S/ {product.precioComparativo.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm hover:brightness-110"
                                        style={{ backgroundColor: "var(--store-primary)", color: "var(--store-primary-text)" }}
                                    >
                                        Ver Ahora
                                        <ArrowRight size={14} />
                                    </div>
                                </div>

                                {/* IMAGEN: Aumentada a 60% de ancho y con escalado interno */}
                                <div className="w-full md:w-[60%] h-64 sm:h-full relative flex items-center justify-center z-10 order-1 md:order-2">
                                    <div className="relative w-full h-full transition-transform duration-500 hover:scale-110 scale-105 md:scale-125">
                                        <Image
                                            src={product.imagenes?.[0] || "/logo.svg"}
                                            alt={product.nombre}
                                            fill
                                            priority
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                            className="object-contain" // Eliminado el padding para máximo tamaño
                                        />
                                    </div>

                                    {discountPercentage > 0 && (
                                        <div
                                            className="absolute top-2 right-2 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transform rotate-12 z-20"
                                            style={{ backgroundColor: "var(--store-primary)", color: "var(--store-primary-text)" }}
                                        >
                                            <span className="text-[10px] md:text-sm">-{discountPercentage}%</span>
                                            <span className="text-[7px] md:text-[8px] uppercase">OFF</span>
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