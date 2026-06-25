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

    // --- NUEVO (hasta 30 días desde createdAt) ---
    const isNew = useMemo(() => {
        if (!product.createdAt) return false;
        const days = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return days <= 30;
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
    const nextImage = () =>
        setCurrentIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
    const prevImage = () =>
        setCurrentIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));

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
            className="group relative flex flex-col bg-background"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none z-0" />

            <Link href={`/productos/${product.slug}`} className="relative flex flex-col h-full">

                {/* ── IMAGEN ── */}
                <div className="relative w-full aspect-square bg-background-secondary overflow-hidden">
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
                                        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-1 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10 border border-border"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-1 rounded-full opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:scale-110 z-10 border border-border"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight size={14} />
                                    </button>

                                    {/* Contador */}
                                    <div className="absolute bottom-2 right-2 px-1 flex items-center justify-center py-0.5 bg-white/90 border border-border/30 shadow-xs pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-[9px] font-semibold text-foreground/80 tabular-nums tracking-wide select-none leading-none">
                                            {currentIndex + 1}
                                            <span className="mx-[2px] text-muted-foreground/50 font-normal">/</span>
                                            {previewImages.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground opacity-40">
                            <MdOutlineImageNotSupported size={24} />
                        </div>
                    )}

                    {/* Badges: Superior Izquierda (Nuevo) */}
                    {isNew && (
                        <div className="absolute top-2 left-2 pointer-events-none ">
                            <span className="px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px]  uppercase tracking-wider leading-none">
                                Nuevo
                            </span>
                        </div>
                    )}

                    {/* Badge de Descuento: Superior Derecha Arriba */}
                    {discountPct > 0 && (
                        <div className="absolute top-2 right-2 pointer-events-none z-1">
                            <span className="px-1.5 py-1 bg-primary text-destructive-foreground text-[10px] leading-none ">
                                {discountPct}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* ── INFO ── */}
                <div className="flex flex-col px-2 md:px-3 py-2 gap-1.5">

                    {/* Fila: marca + colores */}
                    <div className="flex items-center justify-between gap-2 min-h-[16px]">
                        {product.brand?.nombre ? (
                            <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wide truncate">
                                {product.brand.nombre}
                            </span>
                        ) : (
                            <span />
                        )}

                        {uniqueColors.length > 0 && (
                            <div
                                className="flex items-center gap-1 shrink-0"
                                onClick={(e) => e.preventDefault()}
                            >
                                {uniqueColors.slice(0, 4).map((c, index) => (
                                    <button
                                        key={`${c}-${index}`}
                                        onClick={(e) => handleColorSelect(e, c)}
                                        className={cn(
                                            "outline-none rounded-full transition-transform duration-150",
                                            selectedColor === c
                                                ? "scale-110 ring-1 ring-offset-1 ring-foreground/20"
                                                : "hover:scale-110"
                                        )}
                                        aria-label={`Color ${c}`}
                                    >
                                        <ColorCircle color={c} size={8} />
                                    </button>
                                ))}
                                {uniqueColors.length > 4 && (
                                    <span className="text-[9px] text-muted-foreground font-medium">
                                        +{uniqueColors.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nombre — altura fija para 2 líneas exactas */}
                    <h3
                        className="text-[12px] md:text-[13px] text-foreground leading-[1.35] overflow-hidden"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "calc(1.35em * 2)",
                        }}
                    >
                        {product.nombre}
                    </h3>

                    {/* Precio + precio comparativo + sin stock */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                            {/* Precio actual */}
                            <span className="text-sm md:text-base text-foreground font-medium leading-none shrink-0">
                                <span className="text-[11px] md:text-[13px] text-muted-foreground font-light">S/</span>
                                {" "}{precio.toFixed(2)}
                            </span>

                            {/* Precio comparativo debajo/lado */}
                            {discountPct > 0 && (
                                <span className="text-[10px] md:text-xs text-muted-foreground line-through leading-none shrink-0">
                                    S/ {product.precioComparativo!.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {stock <= 0 && (
                            <span className="inline-flex items-center bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive whitespace-nowrap leading-tight shrink-0">
                                Sin stock
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}