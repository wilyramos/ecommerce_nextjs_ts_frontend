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
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

// Images 
const ImagenesPorCategoria: Record<string, string> = {
    "celulares": "/celulares.svg",
    "accesorios": "/accesorios.svg",
    "laptops": "/laptops.svg",
    "tablets": "/tablets.svg",
    "audio": "/audio.svg",
    "smartwatches": "/smartwatches.svg",
    "gaming": "/gaming.svg",
    "hogar": "/hogar.svg",
};


export default function CategoriasDestacadas({ categorias }: { categorias: CategoriasList }) {
    return (
        <section className="w-full py-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-6 text-center text-gray-600">Categorías Destacadas</h2>

            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={3000}
                keyBoardControl
                transitionDuration={500}
                containerClass="w-full px-4"
                itemClass="px-2"
            >
                {categorias.map((categoria, index) => (
                    <Link href={`/categoria/${categoria.slug}`} key={index} className="no-underline">
                        <div
                            className="bg-gray-100 rounded-xl shadow-md p-20 text-center text-lg font-semibold hover:bg-gray-200 transition"
                        >
                            <Image
                                src={ImagenesPorCategoria[categoria.slug] || "/logob.svg"}
                                alt={categoria.nombre}
                                width={100}
                                height={100}
                                className="w-24 h-24 mx-auto mb-4 object-contain"
                                quality={100}
                            />
                            {categoria.nombre}
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
