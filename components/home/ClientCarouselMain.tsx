"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
                autoPlaySpeed={6000}
                arrows={false}
                showDots
                containerClass="rounded-3xl overflow-hidden shadow-2xl"
                dotListClass="bottom-6"
                
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden group"
                    >
                        {/* Fondo con imágenes en columnas en alta definición */}
                        <div className="flex w-full h-full">
                            {[0, 1].map((index) => (
                                <div key={index} className="relative w-1/2 h-full">
                                    {product.imagenes?.[index] ? (
                                        <Image
                                            src={product.imagenes[index]}
                                            alt={`${product.nombre} imagen ${index + 1}`}
                                            fill
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                            className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                            quality={90} // Alta calidad
                                            priority={index === 0}
                                        />
                                    ) : (
                                        <div className="bg-neutral-800 w-full h-full flex items-center justify-center text-white text-sm">
                                            Imagen no disponible
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Overlay: fondo oscuro degradado suave + sombra radial */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-transparent z-10 pointer-events-none" />

                        {/* Contenido encima */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-16 max-w-3xl text-white">
                            <span className="uppercase text-xs md:text-sm tracking-widest text-white/70 mb-2 font-light">
                                Producto destacado
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-snug drop-shadow-lg">
                                {product.nombre}
                            </h2>
                            <p className="mt-4 text-white/90 text-base md:text-lg font-light leading-relaxed max-w-xl">
                                {product.descripcion?.slice(0, 140) ??
                                    "Explora calidad e innovación con nuestra tecnología de última generación."}
                            </p>
                            <Link
                                href={`/productos/${product.slug}`}
                                className="mt-6 inline-flex items-center gap-2 bg-white text-black text-sm md:text-base font-semibold px-6 py-2.5 rounded-full shadow-xl hover:bg-gray-200 transition"
                            >
                                Ver producto <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
