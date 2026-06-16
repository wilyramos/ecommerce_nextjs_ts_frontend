// File: frontend/components/home/product/RelatedCarousel.tsx
"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./ProductCard";
import { CustomLeftArrow, CustomRightArrow } from "../layouts/CarouselArrows";
import type { TApiProduct } from "@/src/schemas";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 1,
        partialVisibilityGutter: 30,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 3,
        slidesToSlide: 1,
        partialVisibilityGutter: 20,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 2,
        slidesToSlide: 1,
        partialVisibilityGutter: 10,
    },
};

interface RelatedCarouselProps {
    products: TApiProduct[];
}

export default function RelatedCarousel({ products }: RelatedCarouselProps) {
    return (
        <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
            itemClass="px-2"
        >
            {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
            ))}
        </Carousel>
    );
}