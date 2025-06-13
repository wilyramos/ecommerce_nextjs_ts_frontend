"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Imagen principal con botones */}
            <div className="relative w-full h-80 sm:h-[500px] group overflow-hidden">
                {images.length > 0 ? (
                    <Image
                        src={images[selectedIndex]}
                        alt="Imagen seleccionada"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        quality={100}
                        className="object-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-120"

                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                        Sin imagen
                    </div>
                )}

                {/* Botón anterior */}
                <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow transition-opacity opacity-0 group-hover:opacity-100"
                >
                    <FaChevronLeft />
                </button>

                {/* Botón siguiente */}
                <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow transition-opacity opacity-0 group-hover:opacity-100"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Miniaturas */}
            {/* Miniaturas */}
            <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar py-1 px-1">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`
        relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden 
        border-2 transition-all duration-300 ease-in-out focus:outline-none
        shadow-sm hover:shadow-md
        ${idx === selectedIndex
                                ? "border-indigo-600 ring-2 ring-indigo-400 bg-indigo-50"
                                : "border-gray-200 bg-white"
                            }
      `}
                    >
                        <Image
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            quality={100}
                            className="object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </button>
                ))}
            </div>

        </div>
    );
}
