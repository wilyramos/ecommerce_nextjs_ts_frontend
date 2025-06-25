"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";
import Link from "next/link";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function ClientCarouselMain({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-xl mx-auto px-4">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={5000}
                arrows={false}
                showDots
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="relative w-full h-[450px] md:h-[550px] rounded-3xl overflow-hidden"
                    >
                        {/* Dos imágenes lado a lado */}
                        <div className="flex w-full h-full bg-white">
                            {[0, 1].map((index) => (
                                <div key={index} className="relative w-1/2 h-full">
                                    {product.imagenes?.[index] && (
                                        <Image
                                            src={product.imagenes[index]}
                                            alt={`${product.nombre} imagen ${index + 1}`}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Gradiente inferior más editorial */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent z-10" />

                        {/* Contenido editorial estilo portada */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end items-start px-6 md:px-12 pb-8 text-white">
                            <span className="uppercase text-xs md:text-sm tracking-widest text-white/80 mb-2">
                                Producto destacado
                            </span>
                            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight drop-shadow-xl leading-tight">
                                {product.nombre}
                            </h2>
                            <p className="hidden md:block mt-2 text-sm text-white/80 max-w-md leading-relaxed">
                                {product.descripcion?.slice(0, 90) ??
                                    "Explora lo mejor de nuestra selección, con diseño y funcionalidad incomparables."}
                            </p>
                            <Link href={`/productos/${product.slug}`} className="mt-4 inline-block text-gray-50 text-sm py-1 px-2 rounded-full border">
                                Ver producto
                            </Link>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
