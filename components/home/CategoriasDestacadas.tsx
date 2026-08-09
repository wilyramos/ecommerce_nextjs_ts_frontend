// File: frontend/components/home/CategoriasDestacadas.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import type { CategoryListResponse } from "@/src/schemas/category.schema";
import { routes } from "@/lib/routes";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1440 },
        items: 9,
        slidesToSlide: 2
    },
    desktop: {
        breakpoint: { max: 1440, min: 1024 },
        items: 7,
        slidesToSlide: 2
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 5,
        slidesToSlide: 1
    },
    mobileLarge: {
        breakpoint: { max: 768, min: 480 },
        items: 4,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 480, min: 0 },
        items: 3,
        slidesToSlide: 1
    }
};

export default function CategoriasDestacadas({ categorias }: { categorias: CategoryListResponse }) {
    const categoriasVisibles = categorias.slice(0, 12);

    return (
        <section className="max-w-screen-xl mx-auto px-4 select-none py-6">
            <Carousel
                responsive={responsive}
                infinite={true}
                arrows={false}
                draggable={true}
                swipeable={true}
                itemClass="px-2"
                className="py-1"
            >
                {categoriasVisibles.map((c) => (
                    <Link
                        key={c._id}
                        href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col items-center text-center outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg p-1"
                    >
                        {/* Círculo estilo Shopify */}
                        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background-secondary border border-border group-hover:border-border-hover transition-colors flex items-center justify-center shrink-0">
                            {c.image ? (
                                <Image
                                    src={c.image}
                                    alt={c.nombre}
                                    fill
                                    className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                                    unoptimized
                                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 180px"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground/40">
                                    <ImageOff size={24} strokeWidth={1.5} />
                                </div>
                            )}
                        </div>

                        {/* Etiqueta */}
                        <span className="mt-2.5 text-xs font-medium text-foreground group-hover:text-action-cta transition-colors line-clamp-1 w-full px-1">
                            {c.nombre}
                        </span>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}