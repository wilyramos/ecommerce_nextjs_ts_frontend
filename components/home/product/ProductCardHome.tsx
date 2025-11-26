"use client";

import Image from "next/image";
import Link from "next/link";
import ColorCircle from "@/components/ui/ColorCircle";
import type { ProductResponse } from "@/src/schemas";

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const primaryImage = product.imagenes?.[0] ?? null;
    const hoverImage = product.imagenes?.[1] ?? primaryImage;
    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;
    const color = product.atributos?.Color || product.atributos?.color || null;
    const brand = typeof product.brand === "string" ? product.brand : product.brand?.nombre;

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group flex flex-col bg-white"
        >
            {/* Imagen */}
            <div className="relative aspect-[4/4] bg-white overflow-hidden">
                {primaryImage && (
                    <Image
                        src={primaryImage}
                        alt={product.nombre}
                        fill
                        className="object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                        quality={95}
                    />
                )}

                {hoverImage && (
                    <Image
                        src={hoverImage}
                        alt={`${product.nombre} - vista alternativa`}
                        fill
                        className="object-contain opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={95}
                    />
                )}

                {/* Badge Nuevo */}
                {product.esNuevo && (
                    <div className="absolute top-1 left-1 z-10">
                        <span className="px-2 bg-neutral-100 text-neutral-800 text-[10px] uppercase font-medium tracking-wider">
                            Nuevo
                        </span>
                    </div>
                )}
            </div>

            {/* Contenedor de información con altura fija */}
            <div className="flex flex-col justify-between flex-1 px-2 min-h-[120px]">
                <div className="flex flex-col gap-1">
                    {brand && (
                        <span className="text-xs uppercase tracking-wide text-gray-500">
                            {brand}
                        </span>
                    )}

                    <h3 className="text-sm text-gray-900 leading-snug line-clamp-2">
                        {product.nombre}
                    </h3>

                    {color && (
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-semibold">Color:</span>
                            <ColorCircle color={color} size={12} />
                        </div>
                    )}
                </div>

                {/* Precio */}
                <div className="flex items-baseline gap-2 mt-1">
                    {stock > 0 ? (
                        <>
                            <span className="text-sm font-semibold text-black">
                                S/ {precio.toFixed(2)}
                            </span>
                            {product.precioComparativo && (
                                <span className="text-xs text-gray-400 line-through">
                                    S/ {product.precioComparativo.toFixed(2)}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-sm font-semibold text-neutral-500">
                            Agotado
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
