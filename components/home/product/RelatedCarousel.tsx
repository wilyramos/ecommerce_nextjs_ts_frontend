// File: frontend/components/home/product/RelatedCarousel.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { TApiProduct } from "@/src/schemas";
import { cn } from "@/lib/utils";

interface RelatedCarouselProps {
    products: TApiProduct[];
}

export default function RelatedCarousel({ products }: RelatedCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: false,
        containScroll: "trimSnaps",
        dragFree: true,
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="group/carousel relative w-full">
            {/* Contenedor Viewport Embla */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="-ml-3 flex touch-pan-y md:-ml-4">
                    {products.map((product) => (
                        <div
                            key={product.slug}
                            className="min-w-0 flex-[0_0_50%] pl-3 sm:flex-[0_0_33.333%] lg:flex-[0_0_25%] md:pl-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Flecha Izquierda */}
            {canScrollPrev && (
                <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Ver productos anteriores"
                    className={cn(
                        "absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden size-9 items-center justify-center rounded-full border border-border-primary/80 bg-surface-primary/95 text-text-primary shadow-md backdrop-blur-sm transition-all duration-fast hover:scale-105 hover:bg-surface-primary active:scale-95 sm:flex"
                    )}
                >
                    <ChevronLeft className="size-5" />
                </button>
            )}

            {/* Flecha Derecha */}
            {canScrollNext && (
                <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Ver productos siguientes"
                    className={cn(
                        "absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden size-9 items-center justify-center rounded-full border border-border-primary/80 bg-surface-primary/95 text-text-primary shadow-md backdrop-blur-sm transition-all duration-fast hover:scale-105 hover:bg-surface-primary active:scale-95 sm:flex"
                    )}
                >
                    <ChevronRight className="size-5" />
                </button>
            )}
        </div>
    );
}