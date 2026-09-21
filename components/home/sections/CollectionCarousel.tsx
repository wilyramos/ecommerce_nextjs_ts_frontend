// File: frontend/components/home/sections/CollectionCarousel.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionProduct } from "@/src/schemas/collection.schema";
import ProductCard from "@/components/home/product/ProductCard";
import type { TApiProduct } from "@/src/schemas";

interface Props {
  products: CollectionProduct[];
}

function toApiProduct(p: CollectionProduct): TApiProduct {
  return {
    _id: p._id,
    nombre: p.nombre,
    slug: p.slug,
    precio: p.precio,
    precioComparativo: p.precioComparativo ?? undefined,
    imagenes: p.imagenes,
    stock: p.stock ?? 0,
    categoria: p.categoria,
    isActive: true,
    rating: 0,
    numReviews: 0,
    brand: p.brand,
    atributos: p.atributos ?? {},
  } as TApiProduct;
}

export default function CollectionCarousel({ products }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
    <div className="relative w-full">
      {/* Controles de navegación estilo Apple: discretos, en desktop y sin montarse sobre las tarjetas */}
      <div className="mb-3 hidden items-center justify-end gap-1.5 md:flex">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Anterior"
          className="flex size-8 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-secondary transition-colors duration-fast hover:border-border-strong hover:text-text-primary active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Siguiente"
          className="flex size-8 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-secondary transition-colors duration-fast hover:border-border-strong hover:text-text-primary active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Viewport libre de artefactos visuales */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-3 flex touch-pan-y sm:-ml-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-0 shrink-0 grow-0 pl-3 sm:pl-4 basis-[48%] sm:basis-[33.33%] lg:basis-[25%]"
            >
              <ProductCard product={toApiProduct(product)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}