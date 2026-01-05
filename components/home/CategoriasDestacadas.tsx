"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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
            />
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
        mobile: { breakpoint: { max: 640, min: 0 }, items: 3, partialVisibilityGutter: 30 },
    };

    return (
        <section
            className="
                relative 
                w-full max-w-7xl mx-auto
                px-6 
                pt-12     /* espacio para header */
                pb-5  border-b  
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
                        className="group cursor-pointer bg-white items-center justify-center flex flex-col"
                    >
                        <div
                            className="
                                relative aspect-square w-full 
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
                                        quality={40}
                                        className="
                                            object-contain 
                                            transition-transform duration-500 ease-out
                                            group-hover:scale-105
                                        "
                                    />
                                ) : (
                                    <span className="text-gray-200 text-xs uppercase tracking-widest">
                                        N/A
                                    </span>
                                )}
                            </div>
                        </div>

                        <div

                        >
                            <h3
                                className="
                                    text-xs md:text-base 
                                    font- text-gray-600 
                                    tracking-wide uppercase
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
