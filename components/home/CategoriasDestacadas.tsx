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

export default function CategoriasDestacadas({ categorias }: { categorias: CategoryListResponse }) {
    const filteredCategorias = categorias.filter((c) =>
        Object.keys(ImagenesPorCategoria).includes(c.slug || "")
    );

    return (
        <section className="w-full py-10 bg-gradient-to-r from-sky-50 via-white to-blue-100 justify-center items-center ">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight text-center">
                Categorías Destacadas
            </h2>
            <div className="max-w-7xl mx-auto items-center ">
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
                    {filteredCategorias.map((categoria, index) => (
                        <Link
                            key={index}
                            href={`/categoria/${categoria.slug}`}
                            className="group relative flex flex-col items-center justify-center h-48 w-full bg-white transition-shadow duration-300 p-4 overflow-hidden hover:bg-black hover:text-gray-50 rounded-lg cursor-pointer"
                        >
                            <p className="text-base font-semibold">{categoria.nombre}</p>
                            <Image
                                src={ImagenesPorCategoria[categoria.slug || ""] || "/logob.svg"}
                                alt={categoria.nombre}
                                width={100}
                                height={100}
                                className="mb-3 object-contain transition-transform duration-600 group-hover:scale-120"
                            />
                        </Link>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}