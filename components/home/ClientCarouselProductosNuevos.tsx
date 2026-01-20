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

const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-0">
            <HeaderConTituloConControles
                {...props}
                title="Novedades."
                subtitle="Lo más reciente"
            />
        </div>
    );
};

export default function ClientCarouselProductosNuevos({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
    };

    return (
        <section className="w-full max-w-7xl mx-auto relative pt-20 md:pt-24 px-4 md:px-0 ">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={5000}
                pauseOnHover
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                containerClass="pb-10"
                itemClass="px-2 md:px-3 py-4"
                partialVisible
            >
                {products.map((product) => (
                    <div key={product._id} className="transition-transform duration-500 hover:scale-[1.02]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </Carousel>
        </section>
    );
}