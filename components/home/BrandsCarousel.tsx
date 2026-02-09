"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import type { TBrand } from "@/src/schemas/brands";
import Link from "next/link";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { routes } from "@/lib/routes";


const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => (
    <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8">
        <HeaderConTituloConControles
            {...props}
            title="Marcas."
            subtitle="Las mejores de calidad precio"
        />
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
                autoPlaySpeed={4800}
                renderButtonGroupOutside
                arrows={false}
                customButtonGroup={<AbsoluteHeaderWrapper />}
                containerClass="-mx-3 pb-2"
                itemClass="px-3"
            >
                {brands.map((brand) => (
                    <Link
                        href={routes.catalog({ brand: brand.slug })}
                        key={brand._id}
                        className="
              group
              flex items-center justify-center
              w-24 h-24
              bg-[var(--store-surface)]
              
              hover:bg-[var(--store-surface-hover)]
              transition-all
            "
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.nombre}
                                    fill
                                    quality={60}
                                    className="
                    object-contain
                  "
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-[var(--store-text-muted)]">
                                    <MdOutlineImageNotSupported size={18} />
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
