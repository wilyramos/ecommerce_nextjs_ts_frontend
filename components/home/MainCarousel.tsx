"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";
import Link from "next/link";
import { CustomDot } from "../ui/CustomDot";
import { ShoppingBag, Sparkles } from "lucide-react";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-2xl mx-auto">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                arrows={false}
                showDots
                customDot={<CustomDot />}
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="relative w-full flex flex-col md:flex-row bg-white overflow-hidden group h-auto md:h-[440px]"
                    >
                        {/* Fondo decorativo */}
                        <div className="absolute -bottom-1 -left-20 w-[300px] h-[300px] bg-sky-200 rounded-full z-0 blur-3xl opacity-30"></div>

                        {/* Texto */}
                        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 py-8 sm:py-10 md:py-16 gap-4 sm:gap-5 md:gap-6">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                Nuevo lanzamiento
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {product.nombre}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                                    {product.precio ? `S/. ${product.precio.toFixed(2)}` : "-"}
                                </p>

                                <Link
                                    href={`/productos/${product.slug}`}
                                    className="inline-flex items-center gap-2 px-5 py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors duration-300 text-xs sm:text-sm font-medium"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Ver producto
                                </Link>
                            </div>
                        </div>

                        {/* Imagen del producto */}
                        <div className="relative w-full md:w-1/2 h-[280px] sm:h-[320px] md:h-full z-10">
                            <Image
                                src={product.imagenes?.[0] || "/placeholder.jpg"}
                                alt={product.nombre}
                                fill
                                className="absolute inset-0 object-contain object-center p-10 transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                quality={95}
                                priority
                            />

                            {product.imagenes?.[1] && (
                                <Image
                                    src={product.imagenes[1]}
                                    alt={product.nombre + " hover"}
                                    fill
                                    className="absolute inset-0 object-contain object-center p-10 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    quality={95}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}