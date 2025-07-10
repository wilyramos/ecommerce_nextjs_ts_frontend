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

                       
                        {/* Contenido destacado */}
                        <div className="absolute bottom-1 left-0 w-auto p-4 sm:p-6 md:p-8 flex flex-col  justify-end text-white ">
                        
                            <h2 className="text-base md:text-3xl font-bold leading-snug drop-shadow-lg bg-gradient-to-r from-indigo-700 via-sky-400 to-blue-200 p-1 text-end px-10">
                                {product.nombre}
                            </h2>
                            
                            <div className=" text-xs sm:text-sm md:text-base font-semibold text-end md:text-start">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-white text-black text-xs sm:text-sm md:text-base font-semibold px-5 sm:px-6 py-1.5 rounded-full  transition-colors duration-300 max-w-xs border border-gray-700 hover:text-white hover:bg-black hover:shadow-lg text-end"
                            >
                                Ver producto <ArrowRight className="w-4 h-4" />
                            </Link>
                            
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
