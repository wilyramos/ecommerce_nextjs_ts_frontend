"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ColorCircle from "@/components/ui/ColorCircle";
import type { ProductResponse } from "@/src/schemas";

export default function ProductCard({ product }: { product: ProductResponse }) {
    const color = product.atributos?.Color || null;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);

    const imagenes = product.imagenes ?? [];
    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;

    // Hover image
    const handleMouseEnter = () => {
        if (imagenes.length > 1) setCurrentIndex(1);
    };
    const handleMouseLeave = () => setCurrentIndex(0);

    // Image navigation
    const nextImage = () =>
        setCurrentIndex((prev) =>
            prev === imagenes.length - 1 ? 0 : prev + 1
        );
    const prevImage = () =>
        setCurrentIndex((prev) =>
            prev === 0 ? imagenes.length - 1 : prev - 1
        );

    // Swipe events (mobile)
    const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 30) {
            if (diff > 0) nextImage();
            else prevImage();
        }
        setStartX(null);
    };

    // Drag events (desktop)
    const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
    const handleMouseUp = (e: React.MouseEvent) => {
        if (startX === null) return;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 30) {
            if (diff > 0) nextImage();
            else prevImage();
        }
        setStartX(null);
    };

    return (
        <div
            className="group relative flex flex-col transform transition-transform duration-500 hover:scale-[1.01] overflow-visible bg-white"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-white overflow-hidden rounded-t">
                    {imagenes.length > 0 ? (
                        <div className="relative w-full h-full bg-white">
                            <Image
                                src={imagenes[currentIndex]}
                                alt={product.nombre}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tamaños optimizados
                                priority={currentIndex === 0}
                                className="object-cover transition-opacity duration-300"
                                quality={70}
                            />

                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.preventDefault(); prevImage(); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    <button
                                        onClick={(e) => { e.preventDefault(); nextImage(); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition"
                                        aria-label="Siguiente imagen"
                                    >
                                        <ChevronRight size={15} />
                                    </button>

                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                        {imagenes.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`h-1 w-2 rounded-full transition-colors duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 ${idx === currentIndex ? "bg-black" : "bg-black/40"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}

                    {/* Labels */}
                    {(product.esNuevo || product.precioComparativo) && (
                        <div className="absolute top-4 left-2 right-2 flex justify-between items-start text-[13px] font-semibold">
                            {product.esNuevo && (
                                <span className="px-2 py-0.5 bg-black text-white rounded text-xs shadow-sm">
                                    Nuevo
                                </span>
                            )}
                            {product.precioComparativo && (
                                <span className="px-2 py-0.5 bg-black text-white rounded text-xs shadow-sm ml-auto">
                                    -{Math.round(((product.precioComparativo - precio) / product.precioComparativo) * 100)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* --- SECCIÓN DE INFO CORREGIDA --- */}
                {/* 1. flex-1 y flex-col para que este div ocupe todo el espacio vertical disponible */}
                <div className="flex flex-col flex-1 p-2">
                    {/* Contenedor para marca y nombre */}
                    <div>
                        {/* Fila 1: Marca */}
                        <div className="h-5"> {/* Altura fija para la marca */}
                           <span className="text-xs font-semibold text-gray-500 uppercase">
                               {product.brand?.nombre}
                           </span>
                        </div>
                       
                        {/* Fila 2, 3, 4: Nombre del Producto */}
                        <h3
                            className="text-base text-black line-clamp-3 h-[4.5rem] md:h-[5rem]" // 2. Altura fija
                        >
                            {product.nombre}
                        </h3>
                    </div>

                    {/* Fila 5: Precios y color (empujado hacia abajo) */}
                    {/* 3. mt-auto empuja este div hasta el final del contenedor flex-col */}
                    <div className="flex items-center gap-2 mt-auto pt-1">
                        {color && <ColorCircle color={color} />}
                        <div className="ml-auto flex flex-col items-end leading-tight">
                            {stock > 0 ? (
                                <>
                                    <div className="">
                                        {product.precioComparativo && (
                                        <span className="text-gray-400 text-sm line-through px-2">
                                            s/ {product.precioComparativo.toFixed(2)}
                                        </span>
                                    )}
                                        <span className="text-black text-base ">
                                            s/ {precio.toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">Sin stock</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}