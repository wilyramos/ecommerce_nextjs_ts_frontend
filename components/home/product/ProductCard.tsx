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
import { H3, BadgeText, Price, Muted } from "@/components/ui/TypographyStore";

export default function ProductCard({ product }: { product: TApiProduct }) {
    const searchParams = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImages, setPreviewImages] = useState<string[]>(product.imagenes ?? []);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [startX, setStartX] = useState<number | null>(null);
    const [isNew, setIsNew] = useState(false);

    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;

    // --- COLORES ---
    const uniqueColors = useMemo(() => {
        const colors = new Set<string>();
        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor) colors.add(mainColor);
        
        product.variants?.forEach((v) => {
            const vAttrs = v.atributos as Record<string, string> | undefined;
            const vColor = vAttrs?.Color || vAttrs?.color;
            if (vColor) colors.add(vColor);
        });
        
        return Array.from(colors);
    }, [product]);

    // --- NUEVO ---
    useEffect(() => {
        if (!product.createdAt) return;
        const days = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        setIsNew(days <= 30);
    }, [product.createdAt]);

    // --- DESCUENTO ---
    const discountPct =
        product.precioComparativo && product.precioComparativo > precio
            ? Math.round(((product.precioComparativo - precio) / product.precioComparativo) * 100)
            : 0;

    useEffect(() => {
        const filterColor = searchParams.get("Color") || searchParams.get("color");
        const mainColor = product.atributos?.Color || product.atributos?.color;
        let targetColor = mainColor;

        if (filterColor && uniqueColors.includes(filterColor)) targetColor = filterColor;
        if (!targetColor) return;

        setSelectedColor(targetColor);
        setCurrentIndex(0);

        if (targetColor === mainColor && product.imagenes?.length) {
            setPreviewImages(product.imagenes);
        } else {
            const foundVariant = product.variants?.find((v) => {
                const vAttrs = v.atributos as Record<string, string>;
                return vAttrs?.Color === targetColor || vAttrs?.color === targetColor;
            });
            setPreviewImages(
                foundVariant?.imagenes?.length ? foundVariant.imagenes : (product.imagenes ?? [])
            );
        }
    }, [searchParams, product, uniqueColors]);

    // --- COLOR SELECT ---
    const handleColorSelect = (e: React.MouseEvent | React.TouchEvent, color: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedColor(color);
        setCurrentIndex(0);

        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor === color && product.imagenes?.length) {
            setPreviewImages(product.imagenes);
            return;
        }

        const foundVariant = product.variants?.find((v) => {
            const vAttrs = v.atributos as Record<string, string>;
            return vAttrs?.Color === color || vAttrs?.color === color;
        });
        setPreviewImages(
            foundVariant?.imagenes?.length ? foundVariant.imagenes : (product.imagenes ?? [])
        );
    };

    // --- NAVEGACIÓN IMÁGENES ---
    const nextImage = () => setCurrentIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));

    const handleMouseEnter = () => { if (previewImages.length > 1) setCurrentIndex(1); };
    const handleMouseLeave = () => setCurrentIndex(0);

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

    return (
        <div
            className="group relative flex flex-col bg-background h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-md" />

            <Link href={`/productos/${product.slug}`} className="relative flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                
                {/* ── IMAGEN ── */}
                <div className="relative w-full aspect-square overflow-hidden bg-background-secondary rounded-t-md">
                    {previewImages.length > 0 ? (
                        <>
                            <div
                                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {previewImages.map((img, idx) => {
                                    const isNear =
                                        Math.abs(idx - currentIndex) <= 1 ||
                                        (currentIndex === 0 && idx === previewImages.length - 1) ||
                                        (currentIndex === previewImages.length - 1 && idx === 0);

                                    return isNear ? (
                                        <div key={idx} className="min-w-full h-full relative shrink-0">
                                            <Image
                                                src={img}
                                                alt={`${product.nombre} - vista ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="object-contain mix-blend-multiply"
                                                quality={80}
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div key={idx} className="min-w-full h-full shrink-0" />
                                    );
                                })}
                            </div>

                            {/* Controles navegación */}
                            {previewImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/90 text-foreground p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-muted"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={16} strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/90 text-foreground p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-muted"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight size={16} strokeWidth={1.5} />
                                    </button>

                                    {/* Contador */}
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-background/90 rounded-sm pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                        <BadgeText className="text-foreground tabular-nums">
                                            {currentIndex + 1} <span className="text-muted-foreground/60">/</span> {previewImages.length}
                                        </BadgeText>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground/30">
                            <MdOutlineImageNotSupported size={28} />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                        {isNew && (
                            <BadgeText className="px-1.5 py-1 bg-primary text-primary-foreground rounded-sm">
                                Nuevo
                            </BadgeText>
                        )}
                    </div>
                    
                    {discountPct > 0 && (
                        <div className="absolute top-2 right-2 pointer-events-none">
                            <BadgeText className="px-1.5 py-1 bg-destructive text-destructive-foreground rounded-sm">
                                {discountPct}% OFF
                            </BadgeText>
                        </div>
                    )}
                </div>

                {/* ── INFO ── */}
                <div className="flex flex-col flex-grow px-2 md:px-3 py-3 gap-2">
                    
                    {/* Fila: marca + colores */}
                    <div className="flex items-center justify-between gap-2 h-4">
                        <BadgeText className="truncate">
                            {product.brand?.nombre || "\u00A0"}
                        </BadgeText>

                        {uniqueColors.length > 0 && (
                            <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.preventDefault()}>
                                {uniqueColors.slice(0, 4).map((c, index) => (
                                    <button
                                        key={`${c}-${index}`}
                                        onClick={(e) => handleColorSelect(e, c)}
                                        className={cn(
                                            "p-1 -m-1 outline-none rounded-full transition-transform duration-150 flex items-center justify-center",
                                            selectedColor === c ? "scale-110" : "hover:scale-110"
                                        )}
                                        aria-label={`Seleccionar color ${c}`}
                                    >
                                        <ColorCircle color={c} size={10} />
                                    </button>
                                ))}
                                {uniqueColors.length > 4 && (
                                    <BadgeText className="ml-1">
                                        +{uniqueColors.length - 4}
                                    </BadgeText>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nombre */}
                    <H3 className="line-clamp-2 min-h-[2.75rem] font-normal text-xs md:text-sm text-muted-foreground">
                        {product.nombre}
                    </H3>

                    {/* Precio y Stock */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                            <Price className="flex items-baseline">
                                <Muted className="text-[11px] md:text-xs mr-0.5 inline">S/</Muted>
                                {precio.toFixed(2)}
                            </Price>

                            {discountPct > 0 && (
                                <Muted className="text-[10px] md:text-xs line-through leading-none shrink-0">
                                    S/ {product.precioComparativo!.toFixed(2)}
                                </Muted>
                            )}
                        </div>

                        {stock <= 0 && (
                            <BadgeText className="bg-muted-neutral text-muted-neutral-foreground px-1.5 py-1 rounded-sm whitespace-nowrap shrink-0">
                                Sin stock
                            </BadgeText>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}