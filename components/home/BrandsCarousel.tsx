"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineImageNotSupported } from "react-icons/md";
import type { TBrand } from "@/src/schemas/brands";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";
import { routes } from "@/lib/routes";

const AbsoluteHeaderWrapper = (p: ButtonGroupProps) => (
    <div className="absolute inset-x-0 top-0 z-20 px-4 md:px-8">
        <HeaderConTituloConControles {...p} title="Marcas disponibles" />
    </div>
);

export default function BrandsCarousel({ brands }: { brands: TBrand[] }) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 4 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 3, partialVisibilityGutter: 30 }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-12">
            <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4800}
                arrows={false} renderButtonGroupOutside customButtonGroup={<AbsoluteHeaderWrapper />}
                containerClass="-mx-3 pb-2" itemClass="px-3">

                {brands.map(b => (
                    <Link key={b._id} href={routes.catalog({ brand: b.slug })}
                        className="group flex items-center justify-center w-24 h-24 rounded-lg bg-[var(--store-surface)] hover:bg-[var(--store-surface-hover)] transition">

                        <div className="relative w-full h-full flex items-center justify-center">
                            {b.logo
                                ? <Image src={b.logo} alt={b.nombre} fill quality={60} className="object-contain" />
                                : <MdOutlineImageNotSupported size={18} className="text-[var(--store-text-muted)]" />}
                        </div>

                    </Link>
                ))}

            </Carousel>
        </section>
    );
}