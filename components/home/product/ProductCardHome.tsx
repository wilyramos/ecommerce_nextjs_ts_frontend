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
        <Link href={`/productos/${product.slug}`} className="block w-full">
            {/* CONTENEDOR DE IMAGEN */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 group">
                {primaryImage ? (
                    <>
                        <Image
                            src={primaryImage}
                            alt={product.nombre}
                            fill
                            className={cn(
                                "object-contain transition-transform duration-700 ease-out",
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
            </div>

            {/* TEXTO FUERA DE LA IMAGEN */}
            <div className="mt-3 px-1 text-gray-500 flex justify-between items-center text-xs">
                <h3 className="mb-1 line-clamp-2 text-xs font-medium leading-tight">
                    {product.nombre}
                </h3>

                <span className="">
                    S/ {precio.toFixed(2)}
                </span>
            </div>
        </Link>
    )
}
