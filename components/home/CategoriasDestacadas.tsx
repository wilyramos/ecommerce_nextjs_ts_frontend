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
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8">
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
                px-4 md:px-8
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
    group relative flex flex-col h-full
    rounded-2xl
    bg-[var(--store-surface)]
    transition-all duration-500 ease-out
    hover:-translate-y-1
    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
  "
                    >
                        {/* Imagen */}
                        <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
                            {categoria.image ? (
                                <>
                                    <Image
                                        src={categoria.image}
                                        alt={categoria.nombre}
                                        fill
                                        sizes="(max-width: 640px) 50vw,
         (max-width: 1024px) 33vw,
         (max-width: 1280px) 25vw,
         20vw"
                                        className="
    object-contain
    transition-all duration-700 ease-out
    scale-95 group-hover:scale-105
  "
                                    />

                                    {/* Overlay sutil estilo Apple */}
                                    <div
                                        className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t from-black/5 via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          "
                                    />
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center text-[var(--store-text-muted)] opacity-30">
                                    <MdOutlineImageNotSupported size={36} />
                                </div>
                            )}
                        </div>

                        {/* Texto */}
                        <div className="px-5 py-4">
                            <h3
                                className="
        text-base md:text-lg
        font-semibold
        tracking-tight
        text-center md:text-left
        text-[var(--store-text)]
        transition-colors duration-300
        group-hover:text-[var(--store-primary)]
      "
                            >
                                {categoria.nombre}
                            </h3>
                        </div>
                    </Link>

                ))}
            </Carousel>
        </section>
    );
}