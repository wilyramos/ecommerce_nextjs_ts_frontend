"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoryListResponse } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

const ImagenesPorCategoria: Record<string, string> = {
    "vidrios-templados": "/categorias/vidriotemplado.svg",
    "auriculares-y-audifonos": "/categorias/auriculares.svg",
    "cargadores-y-cables": "/categorias/cable.svg",
    iphone: "/categorias/iphone.svg",
    "fundas-y-carcasas": "/categorias/cases.svg",
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
        <section className="w-full py-5 bg-gradient-to-r from-sky-50 via-white to-blue-100">
            <div className="max-w-7xl mx-auto px-5">
                <h2 className="text-lg font-semibold">
                    Categorías Destacadas
                </h2>

                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={4000}
                    keyBoardControl
                    transitionDuration={400}
                    itemClass="px-3"
                    arrows={false}
                >
                    {filteredCategorias.map((categoria) => (
                        <Link
                            key={categoria._id}
                            href={`/categoria/${categoria.slug}`}
                            className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col items-center text-center group"
                        >
                            <Image
                                src={
                                    ImagenesPorCategoria[categoria.slug || ""] || "/logob.svg"
                                }
                                alt={categoria.nombre}
                                width={90}
                                height={90}
                                className="mb-2 object-contain transition-transform duration-300 group-hover:scale-120"
                            />
                            <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                                {categoria.nombre}
                            </p>
                        </Link>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
