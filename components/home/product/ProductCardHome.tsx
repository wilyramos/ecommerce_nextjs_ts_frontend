"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ProductResponse } from "@/src/schemas"

export default function ProductCardHome({
    product,
}: {
    product: ProductResponse
}) {
    const primaryImage = product.imagenes?.[0]
    const hoverImage = product.imagenes?.[1] ?? primaryImage
    const precio = product.precio ?? 0

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group relative block aspect-[3/4] w-full overflow-hidden bg-muted"
        >
            {/* IMÁGENES */}
            {primaryImage ? (
                <>
                    <Image
                        src={primaryImage}
                        alt={product.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                            "object-cover transition-transform duration-700 ease-out",
                            hoverImage !== primaryImage
                                ? "group-hover:opacity-0"
                                : "group-hover:scale-110"
                        )}
                    />

                    {hoverImage && hoverImage !== primaryImage && (
                        <Image
                            src={hoverImage}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                        />
                    )}
                </>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-white/50">
                        Sin imagen
                    </span>
                </div>
            )}

            {/* GRADIENTE SOLO PARA TEXTO */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* TEXTO */}
            <div className="absolute bottom-0 left-0 z-10 w-full p-4 text-white">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-tight drop-shadow">
                    {product.nombre}
                </h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">
                        S/ {precio.toFixed(2)}
                    </span>

                    {product.precioComparativo && (
                        <span className="text-xs text-white/60 line-through">
                            S/ {product.precioComparativo.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
