"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoriasList } from '@/src/schemas'
import Image from "next/image";
import Link from "next/link";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
};

const ImagenesPorCategoria: Record<string, string> = {

    "vidrios-templados": "/categorias/vidriotemplado.svg",
    "auriculares-y-audifonos": "/categorias/auriculares.svg",
    // "audio-y-multimedia": "/categorias/auriculares.svg",
    "cargadores-y-cables": "/categorias/cable.svg",
    "iphone": "/categorias/iphone.svg",
    "fundas-y-carcasas": "/categorias/cases.svg",
    "celulares": "/categorias/iphone.svg",
    "accesorios-para-celulares": "/categorias/cases.svg",
};


export default function CategoriasDestacadas({ categorias }: { categorias: CategoriasList }) {


    const filteredCategorias = categorias.filter(categoria =>
        Object.keys(ImagenesPorCategoria).includes(categoria.slug)
    );

    // console.log("CategoriasDestacadas", categorias);
    return (
        <section className="w-full py-5 bg-gray-50 flex flex-col items-center">

            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={3500}
                keyBoardControl
                transitionDuration={500}
                containerClass="w-full px-6"
                itemClass="px-2"
                arrows={false}
                
            >
                {filteredCategorias.map((categoria, index) => (
                    <Link href={`/categoria/${categoria.slug}`} key={index} className="no-underline">
                        <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <Image
                                src={ImagenesPorCategoria[categoria.slug] || "/logob.svg"}
                                alt={categoria.nombre}
                                width={100}
                                height={100}
                                className="w-20 h-20 mx-auto mb-4 object-contain"
                                quality={100}
                            />
                            <p className="text-base font-medium text-gray-700">{categoria.nombre}</p>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
