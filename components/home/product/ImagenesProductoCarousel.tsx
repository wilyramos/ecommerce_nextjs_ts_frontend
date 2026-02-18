"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn, ZoomOut } from "lucide-react";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const uniqueImages = useMemo(() => {
        if (!images) return [];
        return Array.from(new Set(images.filter(Boolean)));
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    // Refs para scroll y gestos
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Centrar miniatura activa en Desktop
    useEffect(() => {
        if (thumbnailsRef.current) {
            const container = thumbnailsRef.current;
            const selectedThumb = container.children[selectedIndex] as HTMLElement;

            if (selectedThumb) {
                const containerCenter = container.offsetHeight / 2;
                const thumbCenter = selectedThumb.offsetTop + (selectedThumb.offsetHeight / 2);

                container.scrollTo({
                    top: thumbCenter - containerCenter,
                    behavior: "smooth"
                });
            }
        }
    }, [selectedIndex]);

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % uniqueImages.length);
        setZoom(false);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
        setZoom(false);
    };

    // Lógica de Zoom
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoom) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    // --- Lógica de DRAG / SWIPE ---
    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoom) return; // Deshabilitar swipe si hay zoom
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (zoom) return;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isSignificantSwipe = Math.abs(distance) > 50;

        if (isSignificantSwipe) {
            if (distance > 0) nextImage();
            else prevImage();
        }

        // Reset
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (uniqueImages.length === 0) {
        return (
            <div className="w-full aspect-square bg-[var(--store-bg)] rounded-3xl flex flex-col items-center justify-center text-[var(--store-text-muted)] border border-[var(--store-border)]">
                <ImageOff size={32} strokeWidth={1.2} />
                <span className="text-xs mt-2 font-medium">Imagen no disponible</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-6 bg-white select-none rounded-lg sticky top-24 ">

            {/* MINIATURAS DESKTOP */}
            {uniqueImages.length > 1 && (
                <div className="hidden md:block w-20 shrink-0">
                    <div
                        ref={thumbnailsRef}
                        className="sticky top-24 max-h-[500px] overflow-y-auto no-scrollbar space-y-3 py-2 px-1"
                    >
                        {uniqueImages.map((img, idx) => (
                            <button
                                key={`${img}-${idx}`}
                                onClick={() => setSelectedIndex(idx)}
                                className={`
                                    relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all duration-500
                                    ${selectedIndex === idx
                                        ? "border-[var(--store-primary)] "
                                        : "border-[var(--store-border)] hover:border-[var(--store-text-muted)]"}
                                `}
                            >
                                <Image
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    fill
                                    className="object-contain p-1"
                                    sizes="80px"
                                    quality={20}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* IMAGEN PRINCIPAL */}
            <div className="flex-1 relative group">
                <div
                    className={`relative aspect-square overflow-hidden bg-white transition-all duration-700 ease-in-out 
                        ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    onMouseMove={handleMouseMove}
                    onClick={() => setZoom(!zoom)}
                    // Eventos de Touch para Mobile Drag
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        key={uniqueImages[selectedIndex]}
                        src={uniqueImages[selectedIndex]}
                        alt="Producto principal"
                        fill
                        priority
                        className={`object-contain transition-transform duration-500 ease-out p-4 md:p-8
                            ${zoom ? "scale-[2.5]" : "scale-100"}`}
                        style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
                        quality={100}
                    />

                    {/* Botón Zoom (Solo Desktop) */}
                    <div className="absolute top-4 right-4 p-2.5 bg-white/60 backdrop-blur-lg rounded-full text-[var(--store-text)] opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {zoom ? <ZoomOut size={18} strokeWidth={1.5} /> : <ZoomIn size={18} strokeWidth={1.5} />}
                    </div>

                    {/* Controles Navegación (Visibles en Mobile y Desktop) */}
                    {uniqueImages.length > 1 && !zoom && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/70 md:bg-white/50 backdrop-blur-md text-[var(--store-text)] shadow-sm border border-[var(--store-border)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white active:scale-90 z-10"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/70 md:bg-white/50 backdrop-blur-md text-[var(--store-text)] shadow-sm border border-[var(--store-border)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white active:scale-90 z-10"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={20} strokeWidth={1.5} />
                            </button>
                        </>
                    )}
                </div>

                {/* PAGINACIÓN MÓVIL (Puntos tipo iOS) */}
                {uniqueImages.length > 1 && (
                    <div className="flex md:hidden justify-center items-center gap-2 my-2">
                        {uniqueImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`transition-all duration-500 rounded-full
                                    ${selectedIndex === idx
                                        ? "w-8 h-1 bg-[var(--store-text)]"
                                        : "w-1.5 h-1.5 bg-[var(--store-border)]"}`}
                                aria-label={`Imagen ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}