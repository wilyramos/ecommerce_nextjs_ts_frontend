"use client";

import Image from "next/image";
import Link from "next/link";
import ColorCircle from "@/components/ui/ColorCircle";
import type { ProductResponse } from "@/src/schemas";

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const imagen = product.imagenes?.[0] ?? null;
    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;
    const color = product.atributos?.Color ?? null;
    const brand = typeof product.brand === "string" ? product.brand : product.brand?.nombre;

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group block w-full aspect-square bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded overflow-hidden"
        >
            <div className="flex flex-col h-full">

                {/* Marca + Nombre */}
                <div className="p-2 sm:p-3">
                    {brand && (
                        <span className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 font-bold">
                            {brand}
                        </span>
                    )}
                    <h3 className="text-xs sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
                        {product.nombre}
                    </h3>
                </div>

                {/* Imagen */}
                <div className="relative w-full flex-1">
                    {imagen ? (
                        <Image
                            src={imagen}
                            alt={product.nombre}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={90}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs sm:text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Precio + Color debajo de la imagen */}
                <div className="flex items-center justify-between gap-2 p-2 sm:p-3 mt-auto">
                    {stock > 0 ? (
                        <div className="flex items-center gap-2">
                            {product.precioComparativo && (
                                <span className="text-xs sm:text-sm font-medium text-gray-400 line-through">
                                    s/ {product.precioComparativo.toFixed(2)}
                                </span>
                            )}
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                                s/ {precio.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs sm:text-sm font-medium text-red-500">
                            Sin stock
                        </span>
                    )}
                    {color && <ColorCircle color={color} />}
                </div>

            </div>
        </Link>
    );
}
