"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";
import Link from "next/link";
import { CustomDot } from "../ui/CustomDot";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function ClientCarouselMain({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-2xl mx-auto">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={6000}
                arrows={false}
                showDots
                customDot={<CustomDot />}
                containerClass=""
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="relative w-full h-[300px] md:h-[500px]  overflow-hidden group  border-gray"
                    >
                        {/* Imágenes en columnas */}
                        <div className="flex w-full h-full flex-row md:flex-row ">
                            {[0, 1].map((index) => (
                                <div key={index} className="relative w-full 1 md:w-1/2 md:h-full ">
                                    {product.imagenes?.[index] ? (
                                        <Image
                                            src={product.imagenes[index]}
                                            alt={`${product.nombre} imagen ${index + 1}`}
                                            fill
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                            quality={90}
                                            priority={index === 0}
                                        />
                                    ) : (
                                        <div className=" w-full h-full flex items-center justify-center text-white text-sm">
                                            Imagen no disponible
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="absolute top-10 right-20 z-20">
                            <div className="relative w-fit">
                                <span className="absolute -top-3 -right-2 bg-yellow-400 text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md uppercase">
                                    Oferta
                                </span>
                                <p className="text-sm sm:text-lg md:text-2xl font-extrabold text-white bg-red-500 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                                    {product.precio ? `S/. ${product.precio.toFixed(2)}` : "-"}
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-20 right-6 z-10 flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">

                            {/* Nombre del producto con fondo indigo */}
                            <Link href={`/productos/${product.slug}`}>
                                <h2 className="w-full sm:w-auto text-base sm:text-lg md:text-xl font-semibold text-white tracking-tight leading-snug bg-gradient-to-r from-indigo-500 to-indigo-600 backdrop-blur-sm rounded px-3 py-1 border border-indigo-400/30">
                                    {product.nombre}
                                </h2>
                            </Link>

                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}