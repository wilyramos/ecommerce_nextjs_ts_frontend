'use client'

import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import ProductCard from '@/components/home/product/ProductCard'
import type { Product } from "@/src/schemas"

interface Props {
    products: Product[]
}

export default function ClientCarouselProductosNuevos({ products }: Props) {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 2 }
    }

    

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">

                <div className="relative group">
                    <Carousel
                        responsive={responsive}
                        infinite
                        autoPlay
                        autoPlaySpeed={3000}
                        
                        arrows={false}
                        showDots={false}
                    >
                        {products.map((product) => (
                            <div key={product._id} className="px-2">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
