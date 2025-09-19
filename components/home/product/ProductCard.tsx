"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/src/schemas";
import ColorCircle from "@/components/ui/ColorCircle";
import { FaFireAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
    const color = product.atributos?.Color || null;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) =>
            prev === product.imagenes.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) =>
            prev === 0 ? product.imagenes.length - 1 : prev - 1
        );
    };

    return (
        <div className="group relative flex flex-col bg-white text-gray-700 rounded shadow-xs transform transition-transform duration-500 hover:scale-[1.03] overflow-visible my-2">
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-white overflow-hidden rounded-t">
                    {product.imagenes.length > 0 ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={product.imagenes[currentIndex]}
                                alt={product.nombre}
                                fill
                                className="object-cover transition-opacity duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                quality={70}
                            />

                            {product.imagenes.length > 1 && (
                                <>
                                    {/* flecha izquierda */}
                                    <button
                                        onClick={prevImage}
                                        className="
                      absolute left-2 top-1/2 -translate-y-1/2 
                      bg-black/40 text-white p-1.5 rounded-full
                      opacity-100
                      md:opacity-0 md:group-hover:opacity-100
                      transition
                    "
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {/* flecha derecha */}
                                    <button
                                        onClick={nextImage}
                                        className="
                      absolute right-2 top-1/2 -translate-y-1/2 
                      bg-black/40 text-white p-1.5 rounded-full
                      opacity-100
                      md:opacity-0 md:group-hover:opacity-100
                      transition
                    "
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}

                    {/* Etiquetas */}
                    {(product.esNuevo || product.esDestacado) && (
                        <div className="absolute top-4 left-2 right-2 flex justify-between text-[13px] font-semibold">
                            {product.esNuevo && (
                                <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs shadow-sm">
                                    Nuevo
                                </span>
                            )}
                            {product.esDestacado && (
                                <span className="text-orange-500 rounded text-xs flex items-center gap-1">
                                    <FaFireAlt />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-3 leading-tight">
                        {product.nombre}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto">
                        {color && <ColorCircle color={color} />}
                        <div className="ml-auto font-semibold">
                            <span>s/ </span>
                            {product.precio.toFixed(2)}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
