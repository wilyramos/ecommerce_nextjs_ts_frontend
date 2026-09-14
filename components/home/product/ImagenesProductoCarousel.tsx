// File: frontend/components/home/product/ImagenesProductoCarousel.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import NoImagePlaceholder from "@/components/ui/NoImagePlaceholder";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const uniqueImages = useMemo(() => {
        return Array.from(new Set(images.filter(img => typeof img === 'string' && img.length > 0)));
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

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

    const updateScrollButtons = () => {
        const el = thumbnailsRef.current;
        if (!el) return;
        setCanScrollUp(el.scrollTop > 0);
        setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };

    useEffect(() => {
        const el = thumbnailsRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons);
        return () => el.removeEventListener("scroll", updateScrollButtons);
    }, [uniqueImages]);

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

    const scrollThumbs = (direction: "up" | "down") => {
        const el = thumbnailsRef.current;
        if (!el) return;
        el.scrollBy({ top: direction === "up" ? -120 : 120, behavior: "smooth" });
    };

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
        return <NoImagePlaceholder />;
    }

    return (
        <div className="flex w-full select-none flex-col gap-3 md:flex-row md:gap-4 lg:gap-5">
            {/* Miniaturas en Desktop */}
            {uniqueImages.length > 1 && (
                <div className="hidden w-20 shrink-0 flex-col items-center gap-1 md:flex">
                    <button
                        type="button"
                        onClick={() => scrollThumbs("up")}
                        className={cn(
                            "flex h-6 w-full items-center justify-center rounded-radius-sm text-text-tertiary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary",
                            !canScrollUp && "pointer-events-none opacity-0"
                        )}
                        aria-label="Desplazar miniaturas hacia arriba"
                    >
                        <ChevronUp size={15} strokeWidth={2} />
                    </button>

                    <div
                        ref={thumbnailsRef}
                        className="flex max-h-[520px] w-full flex-col gap-2 overflow-y-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {uniqueImages.map((img, idx) => (
                            <button
                                type="button"
                                key={`${img}-${idx}`}
                                onClick={() => setSelectedIndex(idx)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                className={cn(
                                    "relative aspect-square w-full shrink-0 overflow-hidden rounded-radius-md border bg-surface-secondary/50 p-1 transition-all duration-fast",
                                    selectedIndex === idx
                                        ? "border-brand-primary ring-1 ring-brand-primary shadow-xs"
                                        : "border-border-primary/80 opacity-70 hover:opacity-100 hover:border-border-strong"
                                )}
                            >
                                <Image
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    fill
                                    className="object-contain p-1"
                                    sizes="80px"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollThumbs("down")}
                        className={cn(
                            "flex h-6 w-full items-center justify-center rounded-radius-sm text-text-tertiary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary",
                            !canScrollDown && "pointer-events-none opacity-0"
                        )}
                        aria-label="Desplazar miniaturas hacia abajo"
                    >
                        <ChevronDown size={15} strokeWidth={2} />
                    </button>
                </div>
            )}

            {/* Visor Principal */}
            <div className="relative flex-1">
                <div
                    className={cn(
                        "relative aspect-square w-full overflow-hidden rounded-radius-xl border border-border-primary/80 bg-surface-secondary/40 transition-colors duration-fast",
                        zoom ? "cursor-zoom-out" : "cursor-zoom-in"
                    )}
                    onMouseMove={handleMouseMove}
                    onClick={() => setZoom(!zoom)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {uniqueImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 z-10 rounded-radius-sm border border-border-primary/80 bg-surface-primary/90 px-2 py-0.5 backdrop-blur-md md:hidden">
                            <span className="text-[10px] font-semibold tracking-wider text-text-primary tabular-nums">
                                {selectedIndex + 1} / {uniqueImages.length}
                            </span>
                        </div>
                    )}

                    {currentImgSrc && (
                        <Image
                            key={currentImgSrc}
                            src={currentImgSrc}
                            alt="Vista principal del producto"
                            fill
                            priority
                            className={cn(
                                "object-contain transition-transform duration-fast ease-out",
                                zoom ? "scale-[2.4]" : "scale-100"
                            )}
                            style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
                            unoptimized
                        />
                    )}

                    <div className="absolute right-3 top-3 rounded-radius-md border border-border-primary/60 bg-surface-primary/85 p-1.5 text-text-secondary opacity-0 shadow-xs backdrop-blur-md transition-opacity duration-fast md:group-hover:opacity-100">
                        {zoom ? <ZoomOut size={16} strokeWidth={2} /> : <ZoomIn size={16} strokeWidth={2} />}
                    </div>

                    {uniqueImages.length > 1 && !zoom && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-radius-full border border-border-primary/70 bg-surface-primary/85 text-text-primary opacity-100 shadow-xs backdrop-blur-md transition-all duration-fast hover:bg-surface-primary active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft size={18} strokeWidth={2} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-radius-full border border-border-primary/70 bg-surface-primary/85 text-text-primary opacity-100 shadow-xs backdrop-blur-md transition-all duration-fast hover:bg-surface-primary active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight size={18} strokeWidth={2} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}