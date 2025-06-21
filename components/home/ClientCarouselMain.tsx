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
        <div className="w-full max-w-screen-2xl mx-auto px-4 py-10">
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
                        className="group flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 md:p-10 hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Imagen */}
                        <div className="relative w-full md:w-1/2 aspect-square overflow-hidden rounded-lg">
                            {product.imagenes?.[0] ? (
                                <Image
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    fill
                                    className="object-contain scale-100 group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
                            )}
                        </div>

                        {/* Información */}
                        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                                {product.nombre}
                            </h2>

                            <p className="text-lg text-neutral-700 dark:text-neutral-300">${product.precio}</p>

                            {/* Atributos */}
                            {product.atributos && Object.keys(product.atributos).length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-neutral-600 dark:text-neutral-400">
                                    {Object.entries(product.atributos).map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full capitalize"
                                        >
                                            {key}: {String(value)}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Estado (nuevo/destacado) */}
                            <div className="flex gap-2 justify-center md:justify-start text-xs mt-2">
                                {product.esNuevo && (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full">Nuevo</span>
                                )}
                                {product.esDestacado && (
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full">Destacado</span>
                                )}
                            </div>

                            {/* Botón */}
                            <div className="mt-4">
                                <Link
                                    href={`/producto/${product.slug}`}
                                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition-all duration-300 group"
                                >
                                    Ver producto
                                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
