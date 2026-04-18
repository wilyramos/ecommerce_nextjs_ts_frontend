"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ProductResponse } from "@/src/schemas"

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const primaryImage = product.imagenes?.[0]
    const hoverImage = product.imagenes?.[1] ?? primaryImage
    const price = Number(product.precio) || 0
    const precioComparativo = Number(product.precioComparativo) || 0

    const hasDiscount = precioComparativo > price && price > 0

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group flex flex-col h-full transition-all duration-300"
        >
            {/* Contenedor Imagen - Premium */}
            <div
                className="
                    relative aspect-square w-full
                    overflow-hidden
                    bg-[var(--color-bg-primary)]
                    border border-[var(--color-border-subtle)]
                    transition-all duration-300
                "
            >
                {primaryImage ? (
                    <>
                        {/* Imagen Principal */}
                        <Image
                            src={primaryImage}
                            alt={product.nombre || "Producto"}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, 25vw"
                            priority
                            className={cn(
                                "object-contain p-4 transition-all duration-500 ease-in-out",
                                hoverImage !== primaryImage
                                    ? "group-hover:opacity-0 group-hover:scale-95"
                                    : "group-hover:scale-110"
                            )}
                        />

                        {/* Imagen Hover */}
                        {hoverImage && hoverImage !== primaryImage && (
                            <Image
                                src={hoverImage}
                                alt=""
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="
                                    absolute inset-0
                                    object-contain p-4
                                    opacity-0
                                    transition-all duration-500 ease-in-out
                                    group-hover:opacity-100
                                    group-hover:scale-110
                                "
                            />
                        )}

                        {/* Overlay Hover Sutil */}
                        <div className="absolute inset-0 bg-[var(--color-text-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]">
                        <div className="text-center">
                            <div className="text-[32px] mb-1">∴</div>
                            <span className="text-[9px] uppercase tracking-[0.15em] font-medium">
                                Sin imagen
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Producto - Minimalista Premium */}
            <div className="mt-4 flex flex-col gap-3 flex-1 justify-between">
                {/* Nombre */}
                <h3
                    className="
                        line-clamp-2
                        text-sm md:text-[15px]
                        font-medium
                        text-[var(--color-text-primary)]
                        leading-[1.4]
                        transition-colors duration-300
                        group-hover:text-[var(--color-action-primary)]
                    "
                >
                    {product.nombre}
                </h3>

                {/* Separador Sutil */}
                <div className="h-px bg-[var(--color-border-subtle)] group-hover:bg-[var(--color-border-default)] transition-colors duration-300" />

                {/* Precios - Premium */}
                <div className="flex flex-row gap-1.5">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xs md:text-sm text-[var(--color-text-secondary)] font-normal">
                            S/
                        </span>
                        <span className="text-base md:text-lg font-light text-[var(--color-text-primary)] tracking-tight">
                            {price.toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                    {hasDiscount && (
                        <span className="text-[10px] md:text-[11px] text-[var(--color-text-tertiary)] line-through font-normal tracking-tight">
                            S/ {precioComparativo.toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                    )}


                </div>
            </div>
        </Link>
    )
}