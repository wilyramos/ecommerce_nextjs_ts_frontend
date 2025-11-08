"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// Nota: ProductResponse se infiere de ApiProductSchema, así que 'brand' y 'esNuevo' deberían estar disponibles.
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
        // CAMBIO: Fondo gris muy sutil, bordes redondeados y overflow hidden
        <div className="w-full mx-auto relative bg-white rounded-lg overflow-hidden">
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
                        // CAMBIO: Aumentada la altura en desktop para más "aire"
                        className="relative w-full flex flex-col md:flex-row items-center overflow-hidden group h-auto md:h-[450px] px-6 sm:px-10 md:px-16 py-8 sm:py-10 md:py-16"
                    >
                        {/* Texto */}
                        {/* CAMBIO: Aumentado el gap y centrado el contenido */}
                        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center items-start gap-4">
                            
                            {/* CAMBIO: "Kicker" o Sobretítulo para jerarquía */}
                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                {product.brand?.nombre || (product.esNuevo ? "Nuevo Lanzamiento" : "Destacado")}
                            </span>

                            {/* CAMBIO: Tipografía más pesada y color más sutil */}
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-zinc-900">
                                {product.nombre}
                            </h2>

                            {/* CAMBIO: Ajuste de espaciado y colores */}
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mt-2">
                                {/* Precio principal */}
                                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-800">
                                    {product.precio ? `S/. ${product.precio.toFixed(2)}` : "-"}
                                </p>

                                {/* Precio comparativo */}
                                {product.precioComparativo && product.precioComparativo > product.precio && (
                                    <span className="text-lg sm:text-xl text-zinc-500 line-through">
                                        S/. {product.precioComparativo.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* CAMBIO: Botón sólido para un CTA más fuerte */}
                            <Link
                                href={`/productos/${product.slug}`}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors duration-300 text-sm font-bold"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Ver producto
                            </Link>
                        </div>

                        {/* Imagen del producto */}
                        <div className="relative w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-full z-10 flex justify-center items-center mt-6 md:mt-0">
                            <Image
                                src={product.imagenes?.[0] || "/logoapp.png"}
                                alt={product.nombre}
                                fill
                                // CAMBIO: Añadido un sutil zoom en hover
                                className="absolute inset-0 object-contain object-center transition-all duration-500 ease-in-out opacity-100 group-hover:opacity-0 group-hover:scale-105"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                quality={95}
                                priority
                            />

                            {product.imagenes?.[1] && (
                                <Image
                                    src={product.imagenes[1]}
                                    alt={product.nombre + " hover"}
                                    fill
                                    className="absolute inset-0 object-contain object-center transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    quality={95}
                                />
                            )}
                        </div>
                        
                        {/* Este overlay ya no es muy necesario con el fondo bg-zinc-50, pero no hace daño */}
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/0 via-zinc-50/0 to-zinc-50/0 pointer-events-none"></div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}