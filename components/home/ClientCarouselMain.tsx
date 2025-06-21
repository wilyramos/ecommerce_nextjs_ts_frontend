"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaArrowRight } from "react-icons/fa";
import type { Product } from "@/src/schemas";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function ClientCarouselMain({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={5000}
                arrows={false}
                showDots={true}
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="group flex flex-col md:flex-row items-center gap-4 md:gap-12 p-6"
                    >
                        {/* Imagen */}
                        <div className="relative w-full md:w-1/2 aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                            {product.imagenes?.[0] ? (
                                <Image
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    fill
                                    className="object-contain scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-700" />
                            )}
                        </div>

                        {/* Información */}
                        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                                {product.nombre}
                            </h2>

                            <p className="text-xl font-medium text-neutral-700 dark:text-neutral-300">
                                S/ {product.precio}
                            </p>

                            {/* Atributos */}
                            {product.atributos && Object.keys(product.atributos).length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                    {Object.entries(product.atributos).map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="bg-neutral-200 dark:bg-neutral-700 px-3 py-1 rounded-full capitalize"
                                        >
                                            {key}: {String(value)}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Estado (nuevo/destacado) */}
                            <div className="flex gap-2 justify-center md:justify-start text-xs">
                                {product.esNuevo && (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full">Nuevo</span>
                                )}
                                {product.esDestacado && (
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full">Destacado</span>
                                )}
                            </div>

                            {/* Botón */}
                            <div className="pt-4">
                                <Link
                                    href={`/productos/${product.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-all duration-300"
                                >
                                    Ver producto
                                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
