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
        <div className="group relative bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">

                {/* Marca + Nombre */}
                <div className="p-3 flex flex-col">
                    {brand && (
                        <span className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 font-bold">
                            {brand}
                        </span>
                    )}
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
                        {product.nombre}
                    </h3>
                </div>

                {/* Imagen centrada */}
                <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
                    {imagen ? (
                        <Image
                            src={imagen}
                            alt={product.nombre}
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={90}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs sm:text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Precio, stock y color */}
                <div className="flex items-center justify-between gap-2 p-3 sm:p-4 mt-auto border-t border-gray-100 bg-gray-50/40">
                    {stock > 0 ? (
                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            S/ {precio.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-xs sm:text-sm font-medium text-red-500">
                            Sin stock
                        </span>
                    )}
                    {color && <ColorCircle color={color} />}
                </div>
            </Link>
        </div>
    );
}
