"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import Link from "next/link";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-[var(--store-surface)]">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000}
                showDots
                renderDotsOutside={false}
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                itemClass="w-full"
                containerClass="w-full h-[350px] sm:h-[380px] lg:h-[450px]"
            >
                {products.map((product) => (
                    <div key={product._id} className="w-full h-full">
                        <Link
                            href={`/productos/${product.slug}`}
                            className="relative flex flex-col md:flex-row items-center justify-between w-full h-full px-6 md:px-16 lg:px-32 group"
                        >
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1 mt-2 md:mt-0">
                                <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] mb-1 sm:mb-2 text-[var(--store-text-muted)]">
                                    {product.brand?.nombre || "GoPhone"}
                                </span>

                                <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight lead mb-2 sm:mb-4 lg:mb-6 text-[var(--store-text)]">
                                    {product.nombre}
                                </h2>

                                <div className="flex flex-col items-center md:items-start gap-1">
                                    <span className="text-sm sm:text-xl md:text-3xl font-bold text-[var(--store-text-muted)]">
                                        S/ {product.precio?.toFixed(2)}
                                    </span>
                                
                                </div>
                            </div>

                            {/* IMAGEN: Contenedor con escala sutil */}
                            <div className="w-full md:w-1/2 relative flex items-center justify-center z-10 order-1 md:order-2">
                                <div className="relative w-full h-[140px] sm:h-[240px] md:h-[300px] lg:h-[380px] transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                                    <Image
                                        src={product.imagenes?.[0] || "/logo.svg"}
                                        alt={product.nombre}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 70vw, 40vw"
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </section>
    );
}