"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function ClientCarouselMain({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-xl mx-auto">
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
                        className="relative w-full h-[400px] md:h-[500px] bg-white rounded-xl overflow-hidden"
                    >
                        {/* Contenedor de las dos imágenes lado a lado */}
                        <div className="flex w-full h-full">
                            <div className="w-1/2 h-full relative bg-white">
                                {product.imagenes?.[0] && (
                                    <Image
                                        src={product.imagenes[0]}
                                        alt={`${product.nombre} imagen 1`}
                                        fill
                                        className="object-contain p-4"
                                    />
                                )}
                            </div>
                            <div className="w-1/2 h-full relative bg-white">
                                {product.imagenes?.[1] && (
                                    <Image
                                        src={product.imagenes[1]}
                                        alt={`${product.nombre} imagen 2`}
                                        fill
                                        className="object-contain p-4"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Overlay de texto centrado */}
                        <div className="absolute inset-2 flex items-end justify-center z-5 py-5">
                            <div className="bg-white/40 backdrop-blur-xs px-2 rounded-3xl text-center md:px-6 py-4">
                                <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 uppercase">
                                    {product.nombre}
                                </h2>
                                {/* <p className="text-sm text-neutral-700">S/ {product.precio}</p> */}
                                <div className="pt-1">
                                    <Link
                                        href={`/productos/${product.slug}`}
                                        className="inline-block px-2 py-1 text-xs md:text-sm rounded-md hover:text-gray-950 transition-colors"
                                    >
                                        Ver producto
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
