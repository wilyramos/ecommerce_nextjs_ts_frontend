"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    return (
        <div className="w-full mx-auto relative bg-white">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                showDots
                customDot={<CustomDot />}
                renderDotsOutside
                containerClass="carousel-container"
                itemClass="carousel-item"
                dotListClass="custom-dot-list-style"
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="relative w-full flex flex-col md:flex-row items-center overflow-hidden group h-auto md:h-[380px] px-6 sm:px-10 md:px-16 py-8 sm:py-10 md:py-16"
                    >
                        {/* Texto */}
                        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center items-start gap-4 sm:gap-5 md:gap-6">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-black">
                                {product.nombre}
                            </h2>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                                {/* Precio principal */}
                                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
                                    {product.precio ? `S/. ${product.precio.toFixed(2)}` : "-"}
                                </p>

                                {/* Precio comparativo */}
                                {product.precioComparativo && product.precioComparativo > product.precio && (
                                    <span className="text-sm sm:text-base text-gray-400 line-through">
                                        S/. {product.precioComparativo.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <Link
                                href={`/productos/${product.slug}`}
                                className="mt-4 inline-flex items-center gap-2 px-5 py-2 border border-black text-black rounded-full hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Ver producto
                            </Link>
                        </div>

                        {/* Imagen del producto */}
                        <div className="relative w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-full z-10 flex justify-center items-center mt-6 md:mt-0">
                            <Image
                                src={product.imagenes?.[0] || "/placeholder.jpg"}
                                alt={product.nombre}
                                fill
                                className="absolute inset-0 object-contain object-center transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                quality={95}
                                priority
                            />

                            {product.imagenes?.[1] && (
                                <Image
                                    src={product.imagenes[1]}
                                    alt={product.nombre + " hover"}
                                    fill
                                    className="absolute inset-0 object-contain object-center transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    quality={95}
                                />
                            )}
                        </div>

                        {/* Overlay sutil opcional */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0 pointer-events-none"></div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
