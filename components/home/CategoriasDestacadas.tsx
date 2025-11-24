"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Cambiado a Arrows para estilo más técnico
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
            slidesToScroll: 1,
            breakpoints: {
                '(min-width: 768px)': { align: 'start' }
            }
        },
        [Autoplay({ delay: 5000, stopOnInteraction: true })] // Delay más lento para sensación premium
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-6 md:py-12 bg-white text-black overflow-hidden">
            {/* Header Minimalista: Título a la izquierda, controles a la derecha */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-medium mb-2">
                        Explorar
                    </h2>
                    <p className="text-neutral-500 text-sm uppercase">
                        Selección por Categoría
                    </p>
                </div>

                {/* Controles de Navegación Personalizados */}
                <div className="flex gap-3">
                    <button
                        onClick={scrollPrev}
                        className="group p-3 border border-neutral-200 rounded-full hover:border-black hover:bg-black transition-all duration-300"
                        aria-label="Anterior"
                    >
                        <ArrowLeft className="w-5 h-5 text-neutral-900 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="group p-3 border border-neutral-200 rounded-full hover:border-black hover:bg-black transition-all duration-300"
                        aria-label="Siguiente"
                    >
                        <ArrowRight className="w-5 h-5 text-neutral-900 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Embla Viewport */}
            <div className="overflow-visible" ref={emblaRef}>
                <div className="flex ">
                    {categorias.map((categoria) => (
                        <div
                            key={categoria._id}
                            className="pl-4 md:pl-6 flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_18%]"
                        >
                            <Link
                                href={`/categoria/${categoria.slug}`}
                                className="group block w-full cursor-pointer"
                            >
                                {/* Tarjeta de Imagen */}
                                <div className="relative aspect-square bg-neutral-50 overflow-hidden rounded-xl mb-4 transition-colors duration-500 group-hover:bg-neutral-100">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {categoria.image ? (
                                            <Image
                                                src={categoria.image}
                                                alt={categoria.nombre}
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform mix-blend-multiply"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-neutral-300 text-xs uppercase tracking-widest">
                                                    N/A
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Texto Descriptivo */}
                                <div className="flex items-center justify-between border-t border-transparent group-hover:border-neutral-200 pt-3 transition-all duration-300">
                                    <h3 className="text-sm md:text-base font-medium text-neutral-900">
                                        {categoria.nombre}
                                    </h3>
                                    <ArrowRight className="w-4 h-4 text-neutral-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}