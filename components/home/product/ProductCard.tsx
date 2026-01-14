"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ColorCircle from "@/components/ui/ColorCircle";
import type { ProductResponse } from "@/src/schemas";

export default function ProductCard({ product }: { product: ProductResponse }) {
    const color = product.atributos?.Color || product.atributos?.color || null;
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

    // Discounted price calculation in percentage
    const discountedPrice = product.precioComparativo
        ? ((product.precioComparativo - precio) / product.precioComparativo) * 100
        : 0;

    return (
        <div
            className="group relative flex flex-col transform transition-transform duration-500 hover:scale-[1.01] overflow-visible bg-[var(--store-surface)] rounded-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-[var(--store-card-bg)] overflow-hidden rounded-t">
                    {imagenes.length > 0 ? (
                        <div className="relative w-full h-full bg-[var(--store-card-bg)] overflow-hidden">
                            {/* Contenedor de todas las imágenes deslizables */}
                            <div
                                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {imagenes.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full relative">
                                        <Image
                                            src={img}
                                            alt={`${product.nombre} ${idx + 1}`}
                                            fill
                                            sizes=""
                                            className="object-contain"
                                            quality={60}
                                        />
                                    </div>
                                ))}
                            </div>

                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            prevImage();
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            nextImage();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition"
                                        aria-label="Siguiente imagen"
                                    >
                                        <ChevronRight size={15} />
                                    </button>

                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                        {imagenes.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`h-1.5 w-2 rounded transition-colors duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 ${idx === currentIndex ? "bg-black" : "bg-black/40"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                            no image
                        </div>
                    )}

                    {(product.esNuevo || product.precioComparativo) && (
                        <div className="absolute top-4 left-2 right-2 flex justify-between items-start text-[13px] font-semibold">
                            {product.esNuevo && (
                                <span className="px-2 py-0.5 bg-[var(--store-primary)] text-white text-[8px] md:text-xs">
                                    Nuevo
                                </span>
                            )}
                            {product.precioComparativo && (
                                <span className="px-2 py-0.5 bg-[var(--store-primary)] text-white text-[8px] md:text-xs ml-auto">
                                    -{Math.round(discountedPrice)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>


                {/* --- SECCIÓN DE INFO CORREGIDA --- */}
                <div className="flex flex-col flex-1 p-2 ">
                    {/* Contenedor para marca y nombre */}
                    <div className="flex flex-col gap-1 h-[4rem] md:h-[4.5rem]">
                        {/* Marca (1 línea fija) */}
                        <div className="h-5 shrink-0">
                            <span className="text-[10px] md:text-xs font-medium text-[var(--store-text-muted)] uppercase">
                                {product.brand?.nombre}
                            </span>
                        </div>

                        {/* Nombre (reserva 3 líneas aunque tenga menos texto) */}
                        <h3
                            className="text-xs md:text-sm text-[var(--store-text)] md:leading-snug
               line-clamp-3 min-h-[3.2rem] md:min-h-[3.6rem]"
                        >
                            {product.nombre}
                        </h3>
                    </div>


                    {/* Fila 5: Precios y color (empujado hacia abajo) */}
                    {/* 3. mt-auto empuja este div hasta el final del contenedor flex-col */}
                    <div className="flex items-center gap-2 mt-auto pt-4">
                        {/* <span className="text-gray-400 text-xs">Color </span> */}
                        {color && <ColorCircle color={color} size={12} />}
                        <div className="ml-auto flex flex-col items-end md:leading-tight">
                            {stock > 0 ? (
                                <>
                                    <div className="space-x-2">
                                        {(product.precioComparativo ?? 0) > 0 && (
                                            <span className="text-[var(--store-text-muted)] text-[10px] md:text-xs line-through px-1 font-light">
                                                s/ {product.precioComparativo!.toFixed(2)}
                                            </span>
                                        )}
                                        <span className="text-[var(--store-text)] text-xs md:text-base">
                                            s/ {precio.toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-[var(--store-text-muted)] text-sm bg-[var(--store-surface-hover)] px-1 rounded">Sin stock</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}