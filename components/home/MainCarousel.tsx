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
    all: { breakpoint: { max: 3000, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-[#F5F5F7] py-2 md:py-8">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={5000}
                showDots
                renderDotsOutside={false}
                dotListClass=""
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-2 md:px-6"
            >
                {products.map((product) => (
                    <div key={product._id} className="w-full">
                        <Link
                            href={`/productos/${product.slug}`}
                            className="group relative flex flex-row items-center justify-between 
                                       h-[320px] md:h-[360px] w-full max-w-[1200px] 
                                       mx-auto overflow-hidden rounded-[28px] bg-[#FFFFFF]
                                       transition-all duration-500 border border-[#ebe8e8] hover:shadow-md"
                        >
                            <div className="w-3/5 md:w-1/2 flex flex-col justify-center pl-8 md:pl-20 z-10">
                                {/* Badge Sutil */}
                                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-[#86868B] mb-2">
                                    {product.esNuevo ? "Nuevo" : product.brand?.nombre}
                                </span>

                                {/* Título Estilo Apple */}
                                <h2 className="text-xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight leading-tight mb-4 max-w-[280px] md:max-w-md">
                                    {product.nombre}
                                </h2>

                                {/* Precio y CTA */}
                                <div className="flex items-center gap-6">
                                    <span className="text-sm md:text-xl font-normal text-[#1D1D1F]">
                                        S/ {product.precio?.toFixed(2)}
                                    </span>
                                    <div className="flex items-center text-[#0071E3] hover:text-[#005BB5] text-xs md:text-lg font-medium group/link transition-colors">
                                        Ver más
                                        <ChevronRight size={18} className="ml-0.5 transition-transform group-hover/link:translate-x-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="w-2/5 md:w-1/2 relative h-full flex items-center justify-center p-6 md:p-14">
                                <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                                    <Image
                                        src={product.imagenes?.[0] || "/placeholder.png"}
                                        alt={product.nombre}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 40vw, 50vw"
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Gradiente de profundidad refinado */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-transparent to-transparent opacity-40 pointer-events-none" />
                        </Link>
                    </div>
                ))}
            </Carousel>
        </section>
    );
}