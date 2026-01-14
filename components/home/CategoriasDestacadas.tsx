"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import Link from "next/link";
import type { CategoryListResponse } from "@/src/schemas";
import HeaderConControles from "../ui/HeaderConTituloConControles";

// Header flotante con controles
const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-6">
            <HeaderConControles {...props} title="Categorías" />
        </div>
    );
};

interface Props {
    categorias: CategoryListResponse;
}

export default function ClientCarouselCategorias({ categorias }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2,
            partialVisibilityGutter: 30,
        },
    };

    return (
        <section
            className="
        relative
        w-full max-w-7xl mx-auto
        px-6
        pt-14          /* espacio real para header */
        pb-8
        border-b border-[var(--store-border)]
        bg-[var(--store-bg)]
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
                containerClass="-mx-3"
                itemClass="px-3"
                partialVisible
            >
                {categorias.map((categoria) => (
                    <Link
                        key={categoria._id}
                        href={`/categoria/${categoria.slug}`}
                        className="
              group
              flex flex-col items-center
              gap-3
              p-3
              rounded-lg
              bg-[var(--store-surface)]
              hover:bg-[var(--store-surface-hover)]
              transition-colors
            "
                    >
                        {/* Imagen */}
                        <div
                            className="
                relative
                w-full aspect-square
                rounded-md
                overflow-hidden
                flex items-center justify-center
                bg-[var(--store-surface)]
              "
                        >
                            {categoria.image ? (
                                <Image
                                    src={categoria.image}
                                    alt={categoria.nombre}
                                    width={220}
                                    height={220}
                                    quality={45}
                                    className="
                    object-contain
                    transition-transform duration-500 ease-out
                    group-hover:scale-105
                  "
                                />
                            ) : (
                                <span className="text-xs uppercase tracking-widest text-[var(--store-text-muted)]">
                                    N/A
                                </span>
                            )}
                        </div>

                        {/* Texto */}
                        <h3
                            className="
                text-xs md:text-sm
                font-medium
                tracking-wide uppercase
                text-center
                text-[var(--store-text)]
              "
                        >
                            {categoria.nombre}
                        </h3>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
