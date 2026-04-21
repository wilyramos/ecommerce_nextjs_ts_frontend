"use client"

import Image from "next/image"
import Link from "next/link"
import type { ProductResponse } from "@/src/schemas"
import { MdOutlineImageNotSupported } from "react-icons/md"

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const img1 = product.imagenes?.[0]
    const img2 = product.imagenes?.[1] || img1

    const price = Number(product.precio) || 0
    const compare = Number(product.precioComparativo) || 0
    const discount = compare > price

    return (
        <Link href={`/productos/${product.slug}`} className="group block p-2">

            {/* Imagen */}
            <div className="relative aspect-square border overflow-hidden">
                {img1 ? (
                    <>
                        <Image
                            src={img1}
                            alt={product.nombre || "Producto"}
                            fill
                            className={`object-contain p-4 transition ${img2 !== img1 ? "group-hover:opacity-0" : "group-hover:scale-105"
                                }`}
                        />

                        {img2 !== img1 && (
                            <Image
                                src={img2 || img1}
                                alt=""
                                fill
                                className="absolute inset-0 object-contain p-4 opacity-0 group-hover:opacity-100 transition"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <MdOutlineImageNotSupported size={40} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
                <h3 className="text-xs md:text-sm line-clamp-2 group-hover:text-[var(--color-text-secondary)] transition-colors">
                    {product.nombre}
                </h3>

                <div className="flex items-center gap-2 text-sm">
                    <span>
                        S/{" "}
                        {price.toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                        })}
                    </span>

                    {discount && (
                        <span className="line-through text-gray-400 text-xs">
                            S/ {compare.toLocaleString("es-PE")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}