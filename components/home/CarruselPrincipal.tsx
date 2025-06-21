"use client";

import Image from "next/image";
import Link from "next/link";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 3000, min: 2000 },
        items: 1,
    },
    desktop: {
        breakpoint: { max: 2000, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const Imagenes = [
    { src: "/bg1.webp", alt: "Imagen principal de la tienda 1", url: "/productos/protector-de-pantalla-blindado-lamiglass" },
    // { src: "/b2.webp", alt: "Imagen principal de la tienda 2", url: "/productos/2" },
    // { src: "/bg4.webp", alt: "Imagen principal de la tienda 4", url: "/productos/4" },
];

export default function CarruselPrincipal() {
    return (
        <div className="w-full relative overflow-hidden max-w-screen-2xl mx-auto">
            <Carousel
                responsive={responsive}
                autoPlay
                infinite
                autoPlaySpeed={4000}
                arrows={false}
                showDots={true}
                className="w-full"
            >
                {Imagenes.map((imagen, index) => (
                    <Link href={imagen.url} key={index}>
                        <div className="relative w-full h-[25vh] md:h-[40vh] lg:h-[50vh] cursor-pointer">

                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" /> */}
                            <Image
                                src={imagen.src}
                                alt={imagen.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                className="object-cover transition-transform duration-700 ease-in-out scale-100 hover:scale-105"
                                priority={index === 0}
                                quality={100}
                                unoptimized 
                            />

                        </div>
                    </Link>
                ))}
            </Carousel>
        </div>
    );
}
