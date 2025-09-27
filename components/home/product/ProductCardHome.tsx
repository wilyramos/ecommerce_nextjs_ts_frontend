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

    return (
        <div className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {imagen ? (
                        <Image
                            src={imagen}
                            alt={product.nombre}
                            fill
                            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={85}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-2">


                    {product.brand && (
                        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            {typeof product.brand === "string" ? product.brand : product.brand.nombre}
                        </span>
                    )}



                    <div className="flex items-center justify-between gap-2 mt-auto">

                        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.nombre}
                        </h3>
                        <div className="ml-auto font-bold text-gray-900 text-xl">
                            {stock > 0 ? (
                                <>
                                    <span className="text-gray-500 text-base font-normal">s/</span>{" "}
                                    {precio.toFixed(2)}
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">Sin stock</span>
                            )}
                            {color && <ColorCircle color={color} />}

                        </div>
                    </div>

                </div>
            </Link>
        </div>
    );
}
