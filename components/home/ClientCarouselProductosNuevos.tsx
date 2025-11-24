"use client";

import Carousel, { ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/home/product/ProductCard";
import type { ProductResponse } from "@/src/schemas";

interface Props {
    products: ProductResponse[];
}

// Header personalizado que incluye Título + Botones de navegación
const HeaderConControles = ({ next, previous }: ButtonGroupProps) => {
    return (
        <div className="flex items-start justify-between mb-8 md:mb-10">
            {/* Título */}

            {/* Botones de control */}
            <div className="flex gap-3">
                <button
                    onClick={() => previous?.()}
                    className="p-3 rounded-full border border-neutral-200 hover:bg-black hover:border-black group transition-all duration-300"
                    aria-label="Anterior"
                >
                    <ArrowLeft className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </button>
                <button
                    onClick={() => next?.()}
                    className="p-3 rounded-full border border-neutral-200 hover:bg-black hover:border-black group transition-all duration-300"
                    aria-label="Siguiente"
                >
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

export default function ClientCarouselProductosNuevos({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2, partialVisibilityGutter: 30 }, // Muestra un poco del siguiente slide
    };

    return (
        <div className="w-full">
            <div>
                <h2 className="text-3xl md:text-4xl font-medium mb-2">
                    Novedades
                </h2>
                <p className="text-neutral-500 text-sm uppercase">
                    Últimos lanzamientos
                </p>
            </div>
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4000}
                pauseOnHover={true}
                arrows={false} // Quitamos las flechas por defecto
                renderButtonGroupOutside={true} // Renderizamos los botones fuera
                customButtonGroup={<HeaderConControles />} // Usamos nuestro header personalizado
                containerClass="-mx-3" // Compensación negativa para el padding de los items
                itemClass="px-3 py-2" // Espaciado entre tarjetas
                partialVisible={true}
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </Carousel>
        </div>
    );
}