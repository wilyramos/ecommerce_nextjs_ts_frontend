"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CollectionProduct } from "@/src/schemas/collection.schema";
import ProductCard from "@/components/home/product/ProductCard";
import type { TApiProduct } from "@/src/schemas";
import { CustomLeftArrow, CustomRightArrow } from "@/components/home/layouts/CarouselArrows";

interface Props {
    products: CollectionProduct[];
}

function toApiProduct(p: CollectionProduct): TApiProduct {
    return {
        _id: p._id,
        nombre: p.nombre,
        slug: p.slug,
        precio: p.precio,
        precioComparativo: p.precioComparativo ?? undefined,
        imagenes: p.imagenes,
        stock: p.stock ?? 0,
        categoria: p.categoria,
        isActive: true,
        rating: 0,
        numReviews: 0,
        brand: p.brand,
        atributos: p.atributos ?? {},
    } as TApiProduct;
}

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 2 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3, slidesToSlide: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2, slidesToSlide: 1 },
};

export default function CollectionCarousel({ products }: Props) {
    return (
        <div className="relative ">
            <Carousel
                responsive={responsive}
                infinite={false}
                keyBoardControl
                removeArrowOnDeviceType={["mobile"]}
                itemClass="pr-4"
                swipeable
                draggable={true}
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={toApiProduct(product)} />
                ))}
            </Carousel>
        </div>
    );
}