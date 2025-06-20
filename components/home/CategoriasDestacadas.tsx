"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoriasList } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

const ImagenesPorCategoria: Record<string, string> = {
    "vidrios-templados": "/categorias/vidriotemplado.svg",
    "auriculares-y-audifonos": "/categorias/auriculares.svg",
    "cargadores-y-cables": "/categorias/cable.svg",
    iphone: "/categorias/iphone.svg",
    "fundas-y-carcasas": "/categorias/cases.svg",
    celulares: "/categorias/iphone.svg",
    "accesorios-para-celulares": "/categorias/cases.svg",
};

export default function CategoriasDestacadas({ categorias }: { categorias: CategoriasList }) {
    const filteredCategorias = categorias.filter((c) =>
        Object.keys(ImagenesPorCategoria).includes(c.slug)
    );

    return (
        <section className="w-full py-10">
            <div className="max-w-7xl mx-auto">
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
                        <div
                            key={index}
                            className="group relative flex flex-col items-center justify-center h-48 w-full bg-white transition-shadow duration-300 p-4 overflow-hidden hover:bg-black hover:text-gray-50 rounded-lg cursor-pointer"
                        >
                             <p className="text-sm font-medium">
                                {categoria.nombre}
                            </p>
                            <Image      
                                src={ImagenesPorCategoria[categoria.slug] || "/logob.svg"}
                                alt={categoria.nombre}
                                width={100}
                                height={100}
                                className="mb-3 object-contain transition-transform duration-600 group-hover:scale-120"
                            />
                           

                            {/* Botón oculto que aparece al hacer hover */}
                            <Link
                                href={`/categoria/${categoria.slug}`}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                            >
                                <span className="text-xs px-4 py-2 bg-white text-black rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                                    Ver categoría
                                </span>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}