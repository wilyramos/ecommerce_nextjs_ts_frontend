"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ButtonGroupProps } from "react-multi-carousel";
import ProductCard from "@/components/home/product/ProductCard";
import type { ProductResponse } from "@/src/schemas";
import HeaderConTituloConControles from "../ui/HeaderConTituloConControles";

interface Props {
    products: ProductResponse[];
}

// Wrapper que recibirá next/previous y posicionará el header arriba (absolute)
const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-0">
            <HeaderConTituloConControles
                {...props}
                title="Novedades"
                subtitle="Últimos lanzamientos"
            />
        </div>
    );
};

export default function ClientCarouselProductosNuevos({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2, partialVisibilityGutter: 30 },
    };

    return (
        <section
            className="
        w-full max-w-7xl mx-auto relative
        pt-24 md:pt-28
        px-4 md:px-0
      "
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4000}
                pauseOnHover
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                containerClass="-mx-3"
                itemClass="px-3 py-4"
                partialVisible
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </Carousel>
        </section>
    );
}
