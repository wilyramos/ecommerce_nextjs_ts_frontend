"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { Sparkle, Tag } from "lucide-react";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";
import { useEffect, useState } from "react";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    const [showDiscount, setShowDiscount] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowDiscount((prev) => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full bg-[var(--store-surface)] overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={7000}
                showDots
                renderDotsOutside
                dotListClass="mt-4 flex justify-center gap-2"
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
            >
                {products.map((product) => {
                    const discountPercentage = product.precioComparativo
                        ? Math.round(
                            ((product.precioComparativo - product.precio) /
                                product.precioComparativo) *
                            100
                        )
                        : 0;

                    return (
                        <Link
                            key={product._id}
                            href={`/productos/${product.slug}`}
                            className="
                group
                relative
                flex flex-col md:flex-row
                items-center justify-between
                max-w-7xl mx-auto
                px-6 md:px-20
                py-10 md:py-16
                gap-10
              "
                        >
                            {/* ===== TEXTO ===== */}
                            <article className="z-10 w-full md:w-1/3 space-y-4 text-center md:text-left order-2 md:order-1">
                                {/* Badge marca / nuevo */}
                                <div
                                    className="
                    inline-flex items-center gap-2
                    px-3 py-1
                    text-[10px] uppercase tracking-wider
                    border border-[var(--store-border)]
                    bg-[var(--store-surface)]
                    text-[var(--store-text-muted)]
                  "
                                >
                                    {product.esNuevo ? (
                                        <Sparkle className="w-3 h-3 text-[var(--store-primary)] animate-pulse" />
                                    ) : (
                                        <Tag className="w-3 h-3" />
                                    )}
                                    {product.brand?.nombre || "Tecnología"}
                                </div>

                                {/* Título */}
                                <h2
                                    className="
                    text-xl sm:text-2xl md:text-3xl
                    font-semibold
                    leading-tight
                    text-[var(--store-text)]
                  "
                                >
                                    {product.nombre}
                                </h2>

                                {/* Precio */}
                                <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-center md:justify-start">
                                    <p
                                        className="
                      text-3xl md:text-4xl
                      font-bold
                      text-[var(--store-text)]
                    "
                                    >
                                        <span className="text-xs font-semibold">S/.</span>{" "}
                                        {product.precio?.toFixed(2) ?? "0.00"}
                                    </p>

                                    {product.precioComparativo &&
                                        product.precioComparativo > product.precio && (
                                            <div className="flex flex-col items-center md:items-start">
                                                {/* Descuento animado */}
                                                <div
                                                    className="
                            relative h-8 w-40
                            overflow-hidden
                            bg-[var(--store-primary)]
                            text-[var(--store-primary-text)]
                            text-xs font-semibold
                            flex items-center justify-center
                          "
                                                >
                                                    <span
                                                        className={`absolute transition-all duration-500
                              ${showDiscount
                                                                ? "translate-y-0 opacity-100"
                                                                : "-translate-y-full opacity-0"
                                                            }`}
                                                    >
                                                        -{discountPercentage}% OFF
                                                    </span>

                                                    <span
                                                        className={`absolute transition-all duration-500
                              ${!showDiscount
                                                                ? "translate-y-0 opacity-100"
                                                                : "translate-y-full opacity-0"
                                                            }`}
                                                    >
                                                        Ahorras S/.{" "}
                                                        {(product.precioComparativo - product.precio).toFixed(2)}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-[var(--store-text-muted)] line-through mt-1">
                                                    S/. {product.precioComparativo.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </article>

                            {/* ===== IMAGEN ===== */}
                              <div className="relative w-full md:w-2/3 h-[260px] sm:h-[300px] md:h-[350px] order-1 md:order-2">
                                <div className="relative w-full h-full perspective-1000">
                                    <Image
                                        src={product.imagenes?.[0] || "/logoapp.png"}
                                        alt={product.nombre}
                                        fill
                                        priority
                                        className="object-contain transition-all duration-700 ease-in-out transform group-hover:scale-110 group-hover:opacity-0 group-hover:rotate-3"
                                    />
                                    {product.imagenes?.[1] && (
                                        <Image
                                            src={product.imagenes[1]}
                                            alt={`${product.nombre} alternate view`}
                                            fill
                                            className="absolute inset-0 object-contain transition-all duration-700 ease-in-out transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105 group-hover:rotate-3"
                                        />
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </Carousel>
        </section>
    );
}
