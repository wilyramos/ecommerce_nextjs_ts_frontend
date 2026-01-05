"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ProductResponse } from "@/src/schemas"

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const primaryImage = product.imagenes?.[0]
    const hoverImage = product.imagenes?.[1] ?? primaryImage
    const price = Number(product.precio) || 0

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="block w-full group bg-white p-2"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white">
                {primaryImage ? (
                    <>
                        <Image
                            src={primaryImage}
                            alt={product.nombre || "Producto"}
                            fill
                            sizes="(max-width:768px) 50vw, 25vw"
                            priority={false}
                            className={cn(
                                "object-contain transition duration-700 ease-out",
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
                                sizes="(max-width:768px) 50vw, 25vw"
                                priority={false}
                                className="absolute inset-0 object-contain opacity-0 transition duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="mt-3 px-1 flex justify-between items-start gap-2">
                <h3 className="line-clamp-2 text-xs md:text-base font-medium text-gray-600 leading-tight">
                    {product.nombre}
                </h3>

                <span className="text- font-medium text-gray-700 whitespace-nowrap">
                    S/ {price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
            </div>
        </Link>
    )
}
