"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ProductCard from "@/components/home/product/ProductCard";
import type { ProductResponse } from "@/src/schemas";
import { CarouselArrow } from "../ui/CarouselArrow";

interface Props {
    products: ProductResponse[];
}

export default function ClientCarouselProductosNuevos({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
    };

    return (
        <div className="relative mx-auto w-auto">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={3000}
                pauseOnHover
                arrows
                showDots={false}
                containerClass="gap-4"
                itemClass="px-2"
                customLeftArrow={<CarouselArrow direction="left" />}
                customRightArrow={<CarouselArrow direction="right" />}
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </Carousel>
        </div>
    );
}