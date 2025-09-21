"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoryListResponse } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 5 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 4 },
};

const ImagenesPorCategoria: Record<string, string> = {
    "vidrios-templados": "/categorias/vidriotemplado.svg",
    "auriculares-y-audifonos": "/categorias/auriculares.svg",
    "cargadores-y-cables": "/categorias/cable.svg",
    iphone: "/categorias/iphone.svg",
    "fundas-y-carcasas": "/categorias/cases.svg",
    // "smartwatches-y-bandas": "/categorias/smartwatch.svg",
    // "tablets": "/categorias/tablet.svg",
    // "laptops": "/categorias/laptop.svg",
};

export default function CategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {
    const filteredCategorias = categorias.filter((c) =>
        Object.keys(ImagenesPorCategoria).includes(c.slug || "")
    );

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
                >
                    {filteredCategorias.map((categoria) => (
                        <Link
                            key={categoria._id}
                            href={`/categoria/${categoria.slug}`}
                            className=" transition p-2 flex flex-col items-center text-center group/item"
                        >
                            <div className="border-2 p-2 rounded-full border-black/10 shadow-xs mb-2 bg-white">
                                <Image
                                src={
                                    ImagenesPorCategoria[categoria.slug || ""] || "/logob.svg"
                                }
                                alt={categoria.nombre}
                                width={90}
                                height={90}
                                className="object-contain transition-transform duration-500 group-hover/item:scale-110"
                            />
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
