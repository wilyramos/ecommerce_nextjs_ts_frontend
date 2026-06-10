"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ColorCircle from "@/components/ui/ColorCircle";
import type { TApiProduct } from "@/src/schemas";
import { cn } from "@/lib/utils";
import { MdOutlineImageNotSupported } from "react-icons/md";

export default function ProductCard({ product }: { product: TApiProduct }) {

    const searchParams = useSearchParams();
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

    useEffect(() => {
        const filterColor = searchParams.get("Color") || searchParams.get("color");
        const mainColor = product.atributos?.Color || product.atributos?.color;
        let targetColor = mainColor;

        if (filterColor && uniqueColors.includes(filterColor)) {
            targetColor = filterColor;
        }

        if (!targetColor) return;

        setSelectedColor(targetColor);
        setCurrentIndex(0);

        if (targetColor === mainColor && product.imagenes && product.imagenes.length > 0) {
            setPreviewImages(product.imagenes);
        } else {
            const foundVariant = product.variants?.find(v => {
                const vAttrs = v.atributos as Record<string, string>;
                return (vAttrs?.Color === targetColor || vAttrs?.color === targetColor);
            });

            if (foundVariant && foundVariant.imagenes && foundVariant.imagenes.length > 0) {
                setPreviewImages(foundVariant.imagenes);
            } else {
                setPreviewImages(product.imagenes ?? []);
            }
        }
    }, [searchParams, product, uniqueColors]);

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
        if (diff > 50) nextImage();
        else if (diff < -50) prevImage();
        setStartX(null);
    };
    const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
    const handleMouseUp = (e: React.MouseEvent) => {
        if (startX === null) return;
        const diff = startX - e.clientX;
        if (diff > 50) nextImage();
        else if (diff < -50) prevImage();
        setStartX(null);
    };

    const discountedPrice = product.precioComparativo
        ? ((product.precioComparativo - precio) / product.precioComparativo) * 100
        : 0;

    return (
        <div
            className="group relative flex flex-col transform transition-transform duration-500 bg-background "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">

                {/* --- IMAGEN --- */}
                <div className="relative w-full aspect-square bg-background-secondary overflow-hidden">
                    {previewImages.length > 0 ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <div
                                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {previewImages.map((img, idx) => {
                                    const isNear = Math.abs(idx - currentIndex) <= 1 ||
                                        (currentIndex === 0 && idx === previewImages.length - 1) ||
                                        (currentIndex === previewImages.length - 1 && idx === 0);

                                    if (!isNear) return <div key={idx} className="min-w-full h-full" />;

                                    return (
                                        <div key={idx} className="min-w-full h-full relative">
                                            <Image
                                                src={img}
                                                alt={`${product.nombre} - vista ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 900px) 80w, 50vw"
                                                className="object-contain mix-blend-multiply"
                                                quality={80}
                                                unoptimized
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Controles Desktop */}
                            {previewImages.length > 1 && (
                                <>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10 border border-border">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10 border border-border">
                                        <ChevronRight size={16} />
                                    </button>

                                    {/* Contador de imágenes dinámico */}
                                    <div className="absolute bottom-2 right-2 z-20 px-1 py-0.5 bg-white/95 border border-border/40 shadow-xs pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-[9px] font-semibold text-foreground/85 tabular-nums tracking-wide select-none leading-none pt-[0.5px]">
                                            {currentIndex + 1}<span className="mx-0.5 text-muted-foreground/50 font-normal">/</span>{previewImages.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground opacity-50">
                            <MdOutlineImageNotSupported size={20} />
                        </div>
                    )}

                    {/* Badges: Descuento y Nuevo */}
                    <div className="absolute top-2 left-4 pointer-events-none flex flex-col gap-1">
                        {(product.precioComparativo ?? 0) > 0 && (
                            <span className="px-1 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-wider">
                                -{Math.round(discountedPrice)}%
                            </span>
                        )}
                     
                    </div>
                </div>

                {/* --- INFO --- */}
                <div className="flex flex-col flex-1 px-2 md:px-4 bg-background py-0.5">
                    <div className="flex flex-col gap-0.5 h-[4.5rem] md:h-[5rem]">

                        <div className="h-5 shrink-0 flex justify-between items-center mb-1">
                            <span className="text-[10px]  md:text-xs font-semibold text-muted-foreground/80 uppercase truncate max-w-[50%]">
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
                                                        ? "scale-110 ring-1 ring-offset-1 ring-foreground/10"
                                                        : "hover:scale-110 hover:z-20"
                                                )}
                                                aria-label={`Seleccionar color ${c}`}
                                            >
                                                <ColorCircle color={c} size={12} />
                                            </button>
                                        );
                                    })}
                                    {uniqueColors.length > 4 && (
                                        <span className="text-[9px] text-muted-foreground pl-1 font-medium">
                                            +{uniqueColors.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <h3 className="text-[13px] text-foreground leading-[1.3] line-clamp-3 min-h-[3.5rem] md:min-h-[3.5rem]">
                            {product.nombre}
                        </h3>

                        <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="mt-auto w-full ">
                        <div className="flex items-end justify-between gap-3">
                            <div className="flex flex-col">
                                {(product.precioComparativo ?? 0) > 0 && (
                                    <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                                        S/ {product.precioComparativo!.toFixed(2)}
                                    </span>
                                )}

                                <span className="text-base md:text-lg text-foreground leading-none">
                                    <span className="text-[13px] md:text-base text-muted-foreground font-light">s/</span> {precio.toFixed(2)}
                                </span>
                            </div>

                            {stock <= 0 && (
                                <span className="inline-flex items-center bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive whitespace-nowrap">
                                    Sin stock
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}