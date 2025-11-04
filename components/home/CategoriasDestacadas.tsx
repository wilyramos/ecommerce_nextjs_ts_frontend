"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas";

export default function CategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: "auto",
        },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-5 bg-white rounded-md my-2 relative">
            <h2 className="text-xl font-medium tracking-tight text-gray-800 mb-6">
                Categorías
            </h2>

            {/* Contenedor principal */}
            <div className="relative">
                {/* Botones de navegación */}
                <button
                    onClick={scrollPrev}
                    className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Embla viewport */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-2 sm:gap-4">
                        {categorias.map((categoria) => (
                            <Link
                                key={categoria._id}
                                href={`/categoria/${categoria.slug}`}
                                className="flex-[0_0_calc(25%_-_0.5rem)] sm:flex-[0_0_calc(16.66%_-_1rem)] flex flex-col items-center text-center group/item"
                            >
                                <div className="flex items-center justify-center">
                                    {categoria.image ? (
                                        <div className="w-16 h-16 sm:w-22 sm:h-22">
                                            <Image
                                                src={categoria.image}
                                                alt={categoria.nombre}
                                                width={120}
                                                height={120}
                                                className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 sm:w-22 sm:h-22 flex items-center justify-center bg-gray-100 rounded-full">
                                            <span className="text-gray-400 text-xs sm:text-sm">
                                                Sin imagen
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="font-medium text-xs sm:text-base text-gray-600 mt-2">
                                    {categoria.nombre}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
