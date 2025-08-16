'use client'

import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import ProductCard from '@/components/home/product/ProductCard'
import type { Product } from "@/src/schemas"

interface Props {
    products: Product[]
    items?: number
}

export default function ClientCarouselProductosNuevos({ products, items }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1280 }, items: items || 4 },
        laptop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
    }

    return (
        <div className="w-full">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={3000}
                pauseOnHover
                arrows={false}
                showDots={false}
                containerClass="gap-4"
                itemClass="px-2"
            >
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </Carousel>
        </div>
    )
}
