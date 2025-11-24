"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import type { TBrand } from "@/src/schemas/brands";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 4 },
};

const HeaderConControles = ({ next, previous }: ButtonGroupProps) => {
    return (
        <div className="flex items-center justify-between mb-8 md:mb-10">
            <div className="flex gap-3">
                <button
                    onClick={() => previous?.()}
                    className="p-3 rounded-full border border-neutral-200 hover:bg-black hover:border-black group transition-all duration-300"
                    aria-label="Anterior"
                >
                    <ArrowLeft
                        className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors"
                        strokeWidth={1.5}
                    />
                </button>

                <button
                    onClick={() => next?.()}
                    className="p-3 rounded-full border border-neutral-200 hover:bg-black hover:border-black group transition-all duration-300"
                    aria-label="Siguiente"
                >
                    <ArrowRight
                        className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors"
                        strokeWidth={1.5}
                    />
                </button>
            </div>
        </div>
    );
};

export default function BrandsCarousel({ brands }: { brands: TBrand[] }) {
    return (
        <section className="w-full">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4800}
                renderButtonGroupOutside
                arrows={false}
                customButtonGroup={<HeaderConControles />}
                itemClass="px-4"
                containerClass="pb-6"
            >
                {brands.map((brand) => (
                    <Link
                        href={`/productos?brand=${brand.slug}`}
                        key={brand._id}
                        className="group flex flex-col items-center space-y-3"
                    >
                        <div className="relative h-24 w-24 flex items-center justify-center ">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.nombre}
                                    fill
                                    className="object-contain p-3 opacity-90 group-hover:opacity-100 transition-opacity"
                                    quality={40}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                                    Sin logo
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
