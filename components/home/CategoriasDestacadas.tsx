"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";
import type { CategoryListResponse } from "@/src/schemas/category.schema";
import { routes } from "@/lib/routes";

const AbsoluteHeaderWrapper = (p: ButtonGroupProps) => (
    <div className="absolute inset-x-0 top-0 z-20 px-4">
        <HeaderConTituloConControles
            {...p}
            viewAllHref="/categorias"
            title={<>Categorías <span className="text-[var(--color-accent-warm)] font-light italic">destacadas.</span></>}
        />
    </div>
);

export default function ClientCarouselCategorias({ categorias }: { categorias: CategoryListResponse }) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6, partialVisibilityGutter: 40 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 5, partialVisibilityGutter: 30 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 5, partialVisibilityGutter: 30 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 4, partialVisibilityGutter: 20 }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 pt-12 md:pt-24 pb-6">
            <Carousel
                responsive={responsive}
                infinite
                autoPlaySpeed={6000}
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass=" py-4"
                partialVisible
            >
                {categorias.map(c => (
                    <Link
                        key={c._id}
                        href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col transition-all duration-500"
                    >
                        {/* Contenedor de Imagen: Sin bordes pesados, fondo muy suave */}
                        <div className="relative aspect-square overflow-hidden  ">
                            {c.image ? (
                                <Image
                                    src={c.image}
                                    alt={c.nombre}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-[var(--color-text-tertiary)] opacity-20">
                                    <ImageOff size={40} strokeWidth={1} />
                                </div>
                            )}
                        </div>

                        {/* Textos: Jerarquía Pequeño/Normal */}
                        <div className="mt-4 px-1 space-y-0.5">

                            <div className="flex items-center justify-center gap-1">
                                <h3 className="text-[8px] md:text-sm  hover:text-destructive transition-colors duration-300">
                                    {c.nombre}
                                </h3>

                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}