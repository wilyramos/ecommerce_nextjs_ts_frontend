"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoriasList } from '@/src/schemas';
import Image from "next/image";
import Link from "next/link";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

const ImagenesPorCategoria: Record<string, string> = {
    "vidrios-templados": "/categorias/vidriotemplado.svg",
    "auriculares-y-audifonos": "/categorias/auriculares.svg",
    "cargadores-y-cables": "/categorias/cable.svg",
    "iphone": "/categorias/iphone.svg",
    "fundas-y-carcasas": "/categorias/cases.svg",
    "celulares": "/categorias/iphone.svg",
    "accesorios-para-celulares": "/categorias/cases.svg",
};

export default function CategoriasDestacadas({ categorias }: { categorias: CategoriasList }) {
    const filteredCategorias = categorias.filter(c =>
        Object.keys(ImagenesPorCategoria).includes(c.slug)
    );

    return (
        <section className="w-full py-5 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-xl md:text-2xl font-semibold text-center text-neutral-800 mb-8">
                    Categorías destacadas
                </h2>

                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={4500}
                    keyBoardControl
                    transitionDuration={400}
                    containerClass="w-full"
                    itemClass="px-2"
                    arrows={false}
                >
                    {filteredCategorias.map((categoria, index) => (
                        <Link
                            href={`/categoria/${categoria.slug}`}
                            key={index}
                            className="block text-center"
                        >
                            <div className="p-4 hover:bg-neutral-100 rounded-md transition-colors">
                                <Image
                                    src={ImagenesPorCategoria[categoria.slug] || "/logob.svg"}
                                    alt={categoria.nombre}
                                    width={72}
                                    height={72}
                                    className="w-16 h-16 mx-auto mb-3 object-contain"
                                    quality={90}
                                />
                                <p className="text-sm text-gray-700">{categoria.nombre}</p>
                            </div>
                        </Link>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
