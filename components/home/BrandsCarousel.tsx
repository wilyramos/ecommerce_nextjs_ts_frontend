"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import type { TBrand } from "@/src/schemas/brands";
import { CarouselArrow } from "../ui/CarouselArrow";
import Link from "next/link";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

export default function BrandsCarousel({ brands }: { brands: TBrand[] }) {

    return (
        <section className="w-full">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={5000}
                customLeftArrow={<CarouselArrow direction="left" />}
                customRightArrow={<CarouselArrow direction="right" />}
                itemClass="px-4"
                containerClass="pb-4"
            >
                {brands.map((brand) => (
                    <Link
                        href={`/marca/${brand.slug}`}
                        key={brand._id}
                        className="group flex flex-col items-center space-y-2"
                    >
                        <div className="relative h-24 w-24 overflow-hidden ">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.nombre}
                                    fill
                                    className="object-contain p-3"
                                    quality={10}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                                    Sin logo
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-700 ">
                            {brand.nombre}
                        </p>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
