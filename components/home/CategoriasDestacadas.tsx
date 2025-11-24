"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryListResponse } from "@/src/schemas";
import HeaderConControles from "../ui/HeaderConTituloConControles";

// Wrapper para colocar el header arriba y recibir next/previous
const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-6">
            <HeaderConControles
                {...props}
                title="Categorías"
                subtitle="Explora nuestras colecciones"
            />
        </div>
    );
};

interface Props {
    categorias: CategoryListResponse;
}

export default function ClientCarouselCategorias({ categorias }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2, partialVisibilityGutter: 30 },
    };

    return (
        <section
            className="
                relative 
                w-full max-w-7xl mx-auto
                px-6 
                pt-24 md:pt-28     /* espacio para header */
                pb-10 md:pb-14 border-b
            "
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={5000}
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                containerClass="-mx-4"
                itemClass="px-4"
                partialVisible
            >
                {categorias.map((categoria) => (
                    <Link
                        key={categoria._id}
                        href={`/categoria/${categoria.slug}`}
                        className="group block cursor-pointer"
                    >
                        <div
                            className="
                                relative aspect-square w-full mb-4 
                                bg-white rounded-md 
                                overflow-hidden 
                                flex items-center justify-center
                            "
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                {categoria.image ? (
                                    <Image
                                        src={categoria.image}
                                        alt={categoria.nombre}
                                        width={200}
                                        height={200}
                                        quality={100}
                                        className="
                                            object-contain 
                                            transition-transform duration-500 ease-out
                                            group-hover:scale-105
                                        "
                                    />
                                ) : (
                                    <span className="text-neutral-300 text-xs uppercase tracking-widest">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            className="
                                flex items-center justify-between 
                                border-t border-neutral-200/0 
                                group-hover:border-neutral-200/80 
                                pt-3 
                                transition-all duration-300
                            "
                        >
                            <h3
                                className="
                                    text-sm md:text-base 
                                    font-medium text-neutral-900 
                                    tracking-wide
                                "
                            >
                                {categoria.nombre}
                            </h3>

                            <ArrowRight
                                className="
                                    w-4 h-4 text-neutral-400 
                                    -translate-x-2 opacity-0 
                                    group-hover:translate-x-0 
                                    group-hover:opacity-100 
                                    transition-all duration-300
                                "
                            />
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
