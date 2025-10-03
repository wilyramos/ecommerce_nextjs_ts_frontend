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

    // Calcular porcentaje de descuento si existe precio comparativo
    const descuento = product.precioComparativo
        ? Math.round(((product.precioComparativo - precio) / product.precioComparativo) * 100)
        : null;

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group block w-full aspect-square bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded overflow-visible relative"
        >
            {/* Badge superior: Nuevo */}
            {product.esNuevo && (
                <div className="absolute -top-4 left-2 z-10">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs shadow-sm rounded-tl-lg rounded-br-lg">
                        Nuevo
                    </span>
                </div>
            )}

            <div className="flex flex-col h-full">

                {/* Marca + Nombre */}
                <div className="p-2 sm:p-3">
                    {brand && (
                        <span className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 font-bold">
                            {brand}
                        </span>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
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
                            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={90}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs sm:text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Color */}
                {color && (
                    <div className="flex justify-start px-2 sm:px-3 mt-2">
                        <ColorCircle color={color} />
                    </div>
                )}

                {/* Precio */}
                <div className="flex items-center justify-between gap-2 p-2 sm:p-3 mt-auto">
                    {/* Lado izquierdo: precio normal + descuento */}
                    <div className="flex items-center gap-2">
                        {stock > 0 ? (
                            <>
                                <span className="text-sm sm:text-base font-semibold text-gray-900">
                                    s/ {precio.toFixed(2)}
                                </span>
                                {descuento && (
                                    <span className="text-xs font-medium text-white bg-black px-1 rounded">
                                        -{descuento}%
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs sm:text-sm font-medium text-red-500">
                                Sin stock
                            </span>
                        )}
                    </div>

                    {/* Lado derecho: precio comparativo tachado */}
                    {product.precioComparativo && (
                        <span className="text-xs sm:text-sm font-medium text-gray-400 line-through">
                            s/ {product.precioComparativo.toFixed(2)}
                        </span>
                    )}
                </div>

            </div>
        </Link>
    );
}
