"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const uniqueImages = useMemo(() => {
        return Array.from(new Set(images.filter(img => typeof img === 'string' && img.length > 0)));
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (selectedIndex >= uniqueImages.length) {
            setSelectedIndex(0);
        }
    }, [uniqueImages, selectedIndex]);

    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoom) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoom) return;
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

        touchStartX.current = null;
        touchEndX.current = null;
    };

    const currentImgSrc = uniqueImages[selectedIndex] || null;

    if (!currentImgSrc || uniqueImages.length === 0) {
        return (
            <div className="w-full aspect-square bg-[var(--color-bg-tertiary)] rounded-3xl flex flex-col items-center justify-center text-[var(--color-text-tertiary)] border border-[var(--color-border-subtle)]">
                <ImageOff size={32} strokeWidth={1.2} />
                <span className="text-xs mt-2 font-medium">Imagen no disponible</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-6 bg-[var(--color-bg-primary)] select-none rounded-lg sticky top-24">

            {/* DESKTOP THUMBNAILS */}
            {uniqueImages.length > 1 && (
                <div className="hidden md:block w-30 shrink-0">
                    <div
                        ref={thumbnailsRef}
                        className="sticky top-24 max-h-[650px] overflow-y-auto no-scrollbar py-2 px-1 md:space-y-2"
                    >
                        {uniqueImages.map((img, idx) => (
                            <button
                                key={`${img}-${idx}`}
                                onClick={() => setSelectedIndex(idx)}
                                className={`
                                    relative aspect-square w-full overflow-hidden border-r-[3px] transition-all duration-500
                                    ${selectedIndex === idx
                                        ? "border-[var(--color-action-primary)]"
                                        : "border-[var(--color-border-default)] hover:border-[var(--color-text-secondary)]"}
                                `}
                            >
                                <Image
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="100px"
                                    quality={20}
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* MAIN IMAGE */}
            <div className="flex-1 relative group">
                <div
                    className={`relative aspect-square overflow-hidden bg-[var(--color-bg-primary)] transition-all duration-700 ease-in-out 
                        ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    onMouseMove={handleMouseMove}
                    onClick={() => setZoom(!zoom)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {currentImgSrc && (
                        <Image
                            key={currentImgSrc}
                            src={currentImgSrc}
                            alt="Producto principal"
                            fill
                            priority
                            className={cn(
                                "object-contain transition-transform duration-500 ease-out p-4 md:p-8",
                                zoom ? "scale-[2.5]" : "scale-100"
                            )}
                            style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
                            quality={100}
                            unoptimized
                        />
                    )}

                    {/* Zoom Button (Desktop Only) */}
                    <div className="absolute top-4 right-4 p-2.5 bg-[var(--color-bg-primary)]/60 backdrop-blur-lg rounded-full text-[var(--color-text-primary)] opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {zoom ? <ZoomOut size={18} strokeWidth={1.5} /> : <ZoomIn size={18} strokeWidth={1.5} />}
                    </div>

                    {/* Navigation Controls */}
                    {uniqueImages.length > 1 && !zoom && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-[var(--color-bg-primary)]/70 md:bg-[var(--color-bg-primary)]/50 backdrop-blur-md text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-default)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-[var(--color-bg-primary)] active:scale-90 z-10"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-[var(--color-bg-primary)]/70 md:bg-[var(--color-bg-primary)]/50 backdrop-blur-md text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border-default)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-[var(--color-bg-primary)] active:scale-90 z-10"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={20} strokeWidth={1.5} />
                            </button>
                        </>
                    )}
                </div>

                {/* MOBILE PAGINATION */}
                {uniqueImages.length > 1 && (
                    <div className="flex md:hidden justify-center items-center gap-2 my-2">
                        {uniqueImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`transition-all duration-500 rounded-full
                                    ${selectedIndex === idx
                                        ? "w-8 h-1 bg-[var(--color-text-primary)]"
                                        : "w-1.5 h-1.5 bg-[var(--color-border-default)]"}`}
                                aria-label={`Imagen ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}