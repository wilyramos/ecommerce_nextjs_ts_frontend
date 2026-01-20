"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import Link from "next/link";
import type { CategoryListResponse } from "@/src/schemas";
import HeaderConControles from "../ui/HeaderConTituloConControles";
import { MdOutlineImageNotSupported } from "react-icons/md";

// Header flotante con controles estilo Apple
const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-0">
            <HeaderConControles
                {...props}
                title="Categorías."
                subtitle="Encuentra lo que buscas"
            />
        </div>
    );
};

interface Props {
    categorias: CategoryListResponse;
}

export default function ClientCarouselCategorias({ categorias }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 5 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2,
            partialVisibilityGutter: 20,
        },
    };

    return (
        <section
            className="
                relative
                w-full max-w-7xl mx-auto
                px-4 md:px-0
                pt-20 md:pt-24
                pb-12
                bg-[var(--store-bg)]
            "
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={6000}
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3"
                partialVisible
            >
                {categorias.map((categoria) => (
                    <Link
                        key={categoria._id}
                        href={`/categoria/${categoria.slug}`}
                        className="
                            group
                            flex flex-col
                            h-full
                            p-6 md:p-8
                            rounded-lg
                            bg-[var(--store-surface)]
                            border border-[var(--store-border)]
                            transition-all duration-500
                            hover:shadow-xl hover:scale-[1.02]
                        "
                    >
                        {/* Contenedor de Imagen */}
                        <div
                            className="
                                relative
                                w-full aspect-square
                                mb-6
                                flex items-center justify-center
                                bg-transparent
                            "
                        >
                            {categoria.image ? (
                                <Image
                                    src={categoria.image}
                                    alt={categoria.nombre}
                                    width={180}
                                    height={180}
                                    className="
                                        object-contain
                                        transition-transform duration-700 ease-out
                                        group-hover:scale-110
                                    "
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-[var(--store-text-muted)] opacity-30">
                                    <MdOutlineImageNotSupported size={32} />
                                </div>
                            )}
                        </div>

                        {/* Texto - Estilo Apple (Más grande y Bold) */}
                        <div className="mt-auto">
                            <h3
                                className="
                                    text-lg md:text-xl
                                    font-bold
                                    tracking-tight
                                    text-center md:text-left
                                    text-[var(--store-text)]
                                    group-hover:text-[var(--store-primary)]
                                    transition-colors
                                "
                            >
                                {categoria.nombre}
                            </h3>
                            <p className="hidden md:block text-xs text-[var(--store-text-muted)] text-left mt-1 font-medium">
                                Ver colección
                            </p>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}