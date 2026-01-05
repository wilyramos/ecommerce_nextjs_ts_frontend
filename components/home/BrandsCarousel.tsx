"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import type { TBrand } from "@/src/schemas/brands";
import Link from "next/link";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";

const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => (
    <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-0">
        <HeaderConTituloConControles {...props} title="Marcas" />
    </div>
);

export default function BrandsCarousel({ brands }: { brands: TBrand[] }) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 3,
            partialVisibilityGutter: 30,
        },
    };

    return (
        <section
            className="
        relative
        pt-10 md:pt-16
        w-full max-w-7xl mx-auto
      "
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4800}
                renderButtonGroupOutside
                arrows={false}
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-3"
                containerClass="pb-6"
            >
                {brands.map((brand) => (
                    <Link
                        href={`/productos?brand=${brand.slug}`}
                        key={brand._id}
                        className="
              group
              flex items-center justify-center
              h-20 w-20
              transition-transform
              hover:scale-105
              cursor-pointer
            "
                    >
                        <div
                            className="
                relative
                w-full h-full
                flex items-center justify-center
                overflow-hidden
              "
                        >
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.nombre}
                                    fill
                                    className="
                    object-contain
                    p-2
                    opacity-90
                    group-hover:opacity-100
                    transition-opacity
                  "
                                    quality={60}
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
