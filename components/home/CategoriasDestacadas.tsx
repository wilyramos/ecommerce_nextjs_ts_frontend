"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineImageNotSupported } from "react-icons/md";
import HeaderConControles from "../ui/HeaderConTituloConControles";
import type { CategoryListResponse } from "@/src/schemas";
import { routes } from "@/lib/routes";

const AbsoluteHeaderWrapper = (p: ButtonGroupProps) => (
    <div className="absolute inset-x-0 top-0 z-20 px-4 md:px-8 flex items-center justify-between">
        <HeaderConControles {...p} title="Categorías." subtitle="Encuentra lo que buscas" />
       
    </div>
);

interface Props { categorias: CategoryListResponse; }

export default function ClientCarouselCategorias({ categorias }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 5 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2, partialVisibilityGutter: 20 }
    };

    return (
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-12">
            <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={6000} arrows={false}
                renderButtonGroupOutside customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3" partialVisible>

                {categorias.map(c => (
                    <Link key={c._id} href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col rounded-xl bg-[var(--store-surface)] transition">

                        <div className="relative aspect-square overflow-hidden rounded-t-xl">
                            {c.image
                                ? <Image src={c.image} alt={c.nombre} fill
                                    sizes="(max-width:640px)50vw,(max-width:1024px)33vw,(max-width:1280px)25vw,20vw"
                                    className="object-contain" />
                                : <div className="flex h-full items-center justify-center text-[var(--store-text-muted)] opacity-30">
                                    <MdOutlineImageNotSupported size={36} />
                                </div>}
                        </div>

                        <h3 className="px-4 py-3 text-sm md:text-base font-semibold tracking-tight text-center md:text-left text-[var(--store-text)] group-hover:text-[var(--store-primary)] transition-colors">
                            {c.nombre}
                        </h3>
                    </Link>
                ))}

            </Carousel>
        </section>
    );
}