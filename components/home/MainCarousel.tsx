"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { ShoppingBag, Sparkle, Tag } from "lucide-react";
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
        <section className="relative w-full mx-auto bg-white overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                showDots
                renderDotsOutside
                dotListClass="custom-dot-list-style"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="carousel-slide"
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="group relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 md:py-16 h-auto md:h-[400px]"
                    >
                        {/* Text Section */}
                        <article className="z-10 w-full md:w-1/2  space-y-3">
                            <div className="w-fit flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-sm">
                                {product.esNuevo ? (
                                    <Sparkle className="w-3 h-3 text-blue-600" />
                                ) : (
                                    <Tag className="w-3 h-3 text-neutral-500" />
                                )}
                                <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
                                    {product.brand?.nombre || "TECNOLOGÍA"}
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
                                {product.nombre}
                            </h2>


                            <div className="flex items-end gap-4">
                                <p className="text-3xl md:text-4xl font-bold text-neutral-900">
                                    S/. {product.precio?.toFixed(2) ?? "0.00"}
                                </p>
                                {product.precioComparativo && product.precioComparativo > product.precio && (
                                    <div className="flex flex-col justify-end pb-1">
                                        <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded mb-1 w-fit">
                                            -{Math.round(((product.precioComparativo - product.precio) / product.precioComparativo) * 100)}% OFF
                                        </span>
                                        <span className="text-lg text-neutral-400 line-through decoration-neutral-400">
                                            S/. {product.precioComparativo.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-gray-800" />

                                <Link
                                    href={`/productos/${product.slug}`}
                                    aria-label={`Ver detalles del producto ${product.nombre}`}
                                    className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition-colors duration-200"
                                >
                                    Ver producto
                                </Link>
                            </div>
                        </article>

                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-[250px] md:h-full flex justify-center mt-6 md:mt-0">
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.imagenes?.[0] || "/logoapp.png"}
                                    alt={product.nombre}
                                    fill
                                    priority
                                    className="object-contain transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                                />

                                {product.imagenes?.[1] && (
                                    <Image
                                        src={product.imagenes[1]}
                                        alt={`${product.nombre} alternate view`}
                                        fill
                                        className="absolute inset-0 object-contain transition-transform duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
