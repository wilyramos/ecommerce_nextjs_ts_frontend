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
        items: 10,
        slidesToSlide: 2
    },
    desktop: {
        breakpoint: { max: 1440, min: 1024 },
        items: 8,
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
        <section className="max-w-7xl mx-auto px-4 select-none relative py-4">
            <Carousel
                responsive={responsive}
                infinite={true}
                arrows={false}
                draggable={true}
                swipeable={true}
                itemClass="px-2 md:px-3"
                className="py-2"
            >
                {categoriasVisibles.map((c) => (
                    <Link
                        key={c._id}
                        href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col items-center text-center transition-all duration-300 focus:outline-none"
                    >
                        {/* Círculo */}
                        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background border border-border group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300 flex items-center justify-center flex-shrink-0">
                            <div className="relative w-full h-full">
                                {c.image ? (
                                    <Image
                                        src={c.image}
                                        alt={c.nombre}
                                        fill
                                        className="object-contain p-3 md:p-4 transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                        sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 200px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground/30">
                                        <ImageOff size={32} strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-3 md:mt-4 text-[11px] md:text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors duration-300 line-clamp-2 w-full px-1 leading-tight tracking-tight">
                            {c.nombre}
                        </h3>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}