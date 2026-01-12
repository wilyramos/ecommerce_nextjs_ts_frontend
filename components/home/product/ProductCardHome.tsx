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
            className="group block w-full"
        >
            {/* Contenedor de Imagen: Fondo gris muy sutil para resaltar el cuero */}
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white">
                {primaryImage ? (
                    <>
                        <Image
                            src={primaryImage}
                            alt={product.nombre || 'Producto Rivas Paredes'}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className={cn(
                                "object-contain p-4 transition-all duration-500 ease-in-out",
                                hoverImage !== primaryImage
                                    ? "group-hover:opacity-0"
                                    : "group-hover:scale-105"
                            )}
                        />

                        {hoverImage && hoverImage !== primaryImage && (
                            <Image
                                src={hoverImage}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="absolute inset-0 object-contain p-4 opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-300 uppercase tracking-widest">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Info del Producto: Limpia, sin decoración extra */}
            <div className="mt-4 flex flex-col gap-1">
                <h3 className="truncate text-sm font-medium text-gray-500 transition-colors group-hover:text-black">
                    {product.nombre}
                </h3>

                <span className="text-sm font-semibold text-gray-900">
                    S/ {price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
            </div>
        </Link>
    )
}