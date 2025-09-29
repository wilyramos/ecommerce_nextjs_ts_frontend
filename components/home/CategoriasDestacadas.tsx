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
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 3 },
};


export default function CategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {

    return (
        <section className="w-full py-5 max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight">
                Categorías Destacadas
            </h2>
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


        </section>
    );
}
