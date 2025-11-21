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
                dotListClass="flex justify-center gap-3 mt-6"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="px-2 md:px-4"
            >
                {products.map((product) => (
                    <Link
                        key={product._id}
                        href={`/productos/${product.slug}`}
                        className="group relative flex flex-col md:flex-row items-center justify-between 
                        px-4 md:px-20 py-5 h-auto md:h-[420px] w-full"
                    >

                        {/* Text Section */}
                        <article className="z-10 w-full md:w-1/3 space-y-3 max-[639px]:space-y-2">

                            <div className="w-fit flex items-center gap-1.5 px-3 py-1 
                                rounded-full bg-white border border-neutral-200 shadow-sm
                                max-[639px]:text-[10px]">
                                {product.esNuevo ? (
                                    <Sparkle className="w-3 h-3 text-blue-600" />
                                ) : (
                                    <Tag className="w-3 h-3 text-neutral-500" />
                                )}
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-800">
                                    {product.brand?.nombre || "TECNOLOGÍA"}
                                </span>
                            </div>

                            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] drop-shadow-sm">
                                {product.nombre}
                            </h2>

                            <div className="flex items-end gap-3">
                                <p className="text-2xl md:text-4xl font-bold text-neutral-900">
                                    S/. {product.precio?.toFixed(2) ?? "0.00"}
                                </p>

                                {product.precioComparativo &&
                                    product.precioComparativo > product.precio && (
                                        <div className="flex flex-col justify-end pb-1">
                                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded w-fit">
                                                -{Math.round(
                                                    ((product.precioComparativo - product.precio) /
                                                        product.precioComparativo) *
                                                    100
                                                )}% OFF
                                            </span>
                                            <span className="text-sm text-neutral-400 line-through decoration-neutral-400">
                                                S/. {product.precioComparativo.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </article>

                        {/* Image Section */}
                        <div className="relative w-full md:w-2/3 
                            h-[320px] md:h-[500px] 
                            py-10 md:py-20 max-[639px]:py-6"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.imagenes?.[0] || "/logoapp.png"}
                                    alt={product.nombre}
                                    fill
                                    priority
                                    className="object-contain transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
                                />
                                {product.imagenes?.[1] && (
                                    <Image
                                        src={product.imagenes[1]}
                                        alt={`${product.nombre} alternate view`}
                                        fill
                                        className="absolute inset-0 object-contain transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
                                    />
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
