"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { CategoriasList } from '@/src/schemas'

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

const categorias = ["Categoria 1", "Categoria 2", "Categoria 3", "Categoria 4"];

export default function CategoriasDestacadas({ categorias }: { categorias: CategoriasList }) {
    return (
        <section className="w-full py-10 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6 text-center">Categorías Destacadas</h2>

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
                    <div
                        key={index}
                        className="bg-gray-100 rounded-xl shadow-md p-20 text-center text-lg font-semibold hover:bg-gray-200 transition"
                    >
                        <img
                            // src={}
                            alt={categoria.nombre}
                            className="w-full h-32 object-cover rounded-t-xl mb-4"
                        />
                        {categoria.nombre}
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
