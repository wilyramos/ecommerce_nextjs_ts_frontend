"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoryListResponse } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";
import { CarouselArrow } from "../ui/CarouselArrow";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 6 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 4 }, // menos items para móviles
};

export default function CategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-5 bg-white rounded-md my-2">
            <h2 className="text-xl font-medium tracking-tight text-gray-800 mb-6">
                Categorías Destacadas
            </h2>
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4000}
                keyBoardControl
                transitionDuration={400}
                containerClass="relative"
                arrows={true}
                customLeftArrow={<CarouselArrow direction="left" />}
                customRightArrow={<CarouselArrow direction="right" />}
                itemClass="px-1 sm:px-2" // menos padding en móviles
                className=""
            >
                {categorias.map((categoria) => (
                    <Link
                        key={categoria._id}
                        href={`/categoria/${categoria.slug}`}
                        className="flex flex-col items-center text-center group/item"
                    >
                        <div className=" flex items-center justify-center">
                            {/* círculo negro detrás */}
                            <div className="absolute w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full -z-10"></div>

                            {/* imagen más grande */}
                            {categoria.image ? (
                                <div className="w-20 h-20 sm:w-28 sm:h-28">
                                    <Image
                                        src={categoria.image}
                                        alt={categoria.nombre}
                                        width={120}
                                        height={120}
                                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center bg-gray-100 rounded-full">
                                    <span className="text-gray-400 text-xs sm:text-sm">Sin imagen</span>
                                </div>
                            )}
                        </div>

                        <p className="font-medium text-sm sm:text-lg text-gray-600">{categoria.nombre}</p>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
