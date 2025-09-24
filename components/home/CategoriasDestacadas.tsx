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
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 5 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 4 },
};


export default function CategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {


    return (
        <section className="w-full py-5">
            <div className="max-w-7xl mx-auto">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={4000}
                    keyBoardControl
                    transitionDuration={400}
                    itemClass=""
                    arrows={true} // siempre true
                    containerClass="relative"
                    customLeftArrow={<CarouselArrow direction="left" />}
                    customRightArrow={<CarouselArrow direction="right" />}
                >
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria._id}
                            href={`/categoria/${categoria.slug}`}
                            className=" transition p-2 flex flex-col items-center text-center group/item"
                        >
                            <div className="border-2 p-2 rounded-full border-black/10 shadow-xs mb-2 bg-white">
                                {categoria.image ? (
                                    <div className="w-20 h-20 rounded-full overflow-hidden">

                                        <Image
                                            src={categoria.image}
                                            alt={categoria.nombre}
                                            width={90}
                                            height={90}
                                            className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
                                        <span className="text-gray-400 text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <p className="font-medium">
                                {categoria.nombre}
                            </p>
                        </Link>
                    ))}
                </Carousel>
            </div>

            {/* estilos para flechas */}
            <style jsx global>{`
                /* Siempre visibles en mobile/tablet */
                @media (max-width: 1023px) {
                    .react-multiple-carousel__arrow {
                        opacity: 1 !important;
                        visibility: visible !important;
                    }
                }

                /* En desktop: ocultas por defecto */
                @media (min-width: 1024px) {
                    .react-multiple-carousel__arrow {
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.3s ease;
                    }
                    /* visibles solo al hacer hover en el contenedor */
                    .group:hover .react-multiple-carousel__arrow {
                        opacity: 1;
                        visibility: visible;
                    }
                }
            `}</style>
        </section>
    );
}
