"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Importar hook de navegación
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ColorCircle from "@/components/ui/ColorCircle";
import type { ProductResponse } from "@/src/schemas";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: ProductResponse }) {
    const searchParams = useSearchParams(); // ✅ Leer parámetros URL
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImages, setPreviewImages] = useState<string[]>(product.imagenes ?? []);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [startX, setStartX] = useState<number | null>(null);

    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;

    // --- LÓGICA DE COLORES ---
    const uniqueColors = useMemo(() => {
        const colors = new Set<string>();
        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor) colors.add(mainColor);

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach((v) => {
                const vAttrs = v.atributos as Record<string, string> | undefined;
                const vColor = vAttrs?.Color || vAttrs?.color;
                if (vColor) colors.add(vColor);
            });
        }
        return Array.from(colors);
    }, [product]);

    // ✅ EFECTO: Sincronizar con Filtros de URL y Color Principal
    useEffect(() => {
        // 1. Obtener color del filtro (si existe)
        const filterColor = searchParams.get("Color") || searchParams.get("color");

        // 2. Obtener color por defecto del producto
        const mainColor = product.atributos?.Color || product.atributos?.color;

        // 3. Determinar qué color mostrar:
        // Prioridad: Filtro URL (si el producto tiene ese color) > Color Principal
        let targetColor = mainColor;

        if (filterColor && uniqueColors.includes(filterColor)) {
            targetColor = filterColor;
        }

        if (!targetColor) return;

        // 4. Actualizar Estado Visual
        setSelectedColor(targetColor);
        setCurrentIndex(0);

        // 5. Buscar y setear imágenes correspondientes
        if (targetColor === mainColor && product.imagenes && product.imagenes.length > 0) {
            // Caso: Es el producto padre
            setPreviewImages(product.imagenes);
        } else {
            // Caso: Es una variante
            const foundVariant = product.variants?.find(v => {
                const vAttrs = v.atributos as Record<string, string>;
                return (vAttrs?.Color === targetColor || vAttrs?.color === targetColor);
            });

            if (foundVariant && foundVariant.imagenes && foundVariant.imagenes.length > 0) {
                setPreviewImages(foundVariant.imagenes);
            } else {
                // Fallback: Si la variante no tiene fotos, mostramos las del padre
                setPreviewImages(product.imagenes ?? []);
            }
        }
    }, [searchParams, product, uniqueColors]); // Se ejecuta cuando cambia la URL o el producto

    // --- SELECCIÓN MANUAL DE COLOR ---
    const handleColorSelect = (e: React.MouseEvent | React.TouchEvent, color: string) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedColor(color);
        setCurrentIndex(0);

        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor === color && product.imagenes && product.imagenes.length > 0) {
            setPreviewImages(product.imagenes);
            return;
        }

        const foundVariant = product.variants?.find(v => {
            const vAttrs = v.atributos as Record<string, string>;
            return (vAttrs?.Color === color || vAttrs?.color === color);
        });

        if (foundVariant && foundVariant.imagenes && foundVariant.imagenes.length > 0) {
            setPreviewImages(foundVariant.imagenes);
        } else {
            setPreviewImages(product.imagenes ?? []);
        }
    };

    // --- EVENTOS IMAGEN ---
    const handleMouseEnter = () => { if (previewImages.length > 1) setCurrentIndex(1); };
    const handleMouseLeave = () => setCurrentIndex(0);
    const nextImage = () => setCurrentIndex((prev) => prev === previewImages.length - 1 ? 0 : prev + 1);
    const prevImage = () => setCurrentIndex((prev) => prev === 0 ? previewImages.length - 1 : prev - 1);

    const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) {
            nextImage();
        } else if (diff < -50) {
            prevImage();
        }
        setStartX(null);
    };
    const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
    const handleMouseUp = (e: React.MouseEvent) => {
        if (startX === null) return;
        const diff = startX - e.clientX;
        if (diff > 50) {
            nextImage();
        } else if (diff < -50) {
            prevImage();
        }
        setStartX(null);
    };

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

                {/* --- IMAGEN --- */}
                <div className="relative w-full aspect-square bg-[var(--store-card-bg)] overflow-hidden rounded-t">
                    {previewImages.length > 0 ? (
                        <div className="relative w-full h-full bg-[var(--store-card-bg)] overflow-hidden">
                            <div
                                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full relative">
                                        <Image
                                            src={img}
                                            alt={`${product.nombre} - vista ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            className="object-contain p-4 mix-blend-multiply"
                                            quality={75}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Controles Desktop */}
                            {previewImages.length > 1 && (
                                <>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-black p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-black p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10">
                                        <ChevronRight size={16} />
                                    </button>
                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                        {previewImages.map((_, idx) => (
                                            <span key={idx} className={`h-1.5 rounded-full transition-all duration-300 opacity-0 md:group-hover:opacity-100 ${idx === currentIndex ? "w-4 bg-black" : "w-1.5 bg-black/30"}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-[var(--store-text-muted)] bg-[var(--store-bg)]">
                            <MdOutlineImageNotSupported size={24} />
                        </div>
                    )}

                    {(product.esNuevo || product.precioComparativo) && (
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
                            {product.esNuevo ? <span className="px-2 py-1 bg-[var(--store-text)] text-[var(--store-surface)] text-[10px] font-bold uppercase tracking-wider rounded-sm">Nuevo</span> : <span />}
                            {product.precioComparativo && <span className="px-2 py-1 bg-[var(--store-primary)] text-white text-[10px] font-bold rounded-sm shadow-sm">-{Math.round(discountedPrice)}%</span>}
                        </div>
                    )}
                </div>

                {/* --- INFO --- */}
                <div className="flex flex-col flex-1 p-3 md:p-4">
                    <div className="flex flex-col gap-1 h-[4.5rem] md:h-[5rem]">

                        <div className="h-5 shrink-0 flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--store-text-muted)] uppercase truncate max-w-[50%]">
                                {product.brand?.nombre || ""}
                            </span>

                            {/* --- COLORES RESPONSIVOS --- */}
                            {uniqueColors.length > 0 && (
                                <div
                                    className={cn(
                                        "flex items-center transition-all duration-300",
                                        "gap-1.5",
                                        "md:gap-0 md:-space-x-1 md:hover:space-x-1"
                                    )}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {uniqueColors.slice(0, 4).map((c, index) => {
                                        const isSelected = selectedColor === c;
                                        return (
                                            <button
                                                key={`${c}-${index}`}
                                                onClick={(e) => handleColorSelect(e, c)}
                                                className={cn(
                                                    "relative transition-transform duration-200 outline-none rounded-full",
                                                    isSelected
                                                        ? " scale-110 ring-1 ring-offset-1 ring-black/30"
                                                        : "hover:scale-110 hover:z-20"
                                                )}
                                                aria-label={`Seleccionar color ${c}`}
                                            >
                                                <ColorCircle color={c} size={12} />
                                            </button>
                                        );
                                    })}
                                    {uniqueColors.length > 4 && (
                                        <span className="text-[9px] text-[var(--store-text-muted)] pl-1 font-medium">
                                            +{uniqueColors.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <h3 className="text-[13px] font-medium text-[var(--store-text)] leading-[1.3] line-clamp-2 md:min-h-[2.6rem]">
                            {product.nombre}
                        </h3>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-transparent group-hover:border-[var(--store-border)] transition-colors">
                        <div className="flex flex-col">
                            {stock > 0 ? (
                                <>
                                    {(product.precioComparativo ?? 0) > 0 && (
                                        <span className="text-[11px] text-[var(--store-text-muted)] line-through">
                                            S/ {product.precioComparativo!.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-sm md:text-[15px] font-bold text-[var(--store-text)]">
                                        S/ {precio.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-[10px] font-bold text-[var(--store-text-muted)] bg-[var(--store-bg)] px-2 py-1 rounded-full">
                                    Agotado
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}