"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Product } from "@/src/schemas";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; 
import { CustomDot } from "../ui/CustomDot";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 2000 }, items: 1 },
    desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

export default function ClientCarouselMain({ products }: { products: Product[] }) {
    return (
        <div className="w-full max-w-screen-2xl mx-auto border-2 rounded-3xl overflow-hidden border-gray-100  ">
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
                        className="relative w-full h-[500px] rounded-3xl overflow-hidden group border"
                    >
                        {/* Imágenes en columnas */}
                        <div className="flex w-full h-full flex-col md:flex-row">
                            {[0, 1].map((index) => (
                                <div key={index} className="relative w-full md:w-1/2 h-1/2 md:h-full">
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

                       
                        {/* Contenido destacado */}
                        <div className="absolute bottom-2 left-0 w-auto h-1/3 p-4 sm:p-6 md:p-8 flex flex-col  justify-end text-white">
                        
                            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold leading-snug drop-shadow-lg bg-black bg-opacity-50 p-2 text-end">
                                {product.nombre}
                            </h2>
                            
                            <Link
                                href={`/productos/${product.slug}`}
                                className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-white text-black text-xs sm:text-sm md:text-base font-semibold px-5 sm:px-6 py-2.5 rounded-full shadow-xl hover:bg-gray-200 transition-colors duration-300 max-w-xs border-2 border-gray-300 hover:border-gray-400"
                            >
                                Ver producto <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
