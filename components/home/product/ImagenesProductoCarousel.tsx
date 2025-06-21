"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const nextImage = () => setSelectedIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Imagen principal */}
            <div className="relative aspect-square">
                {images.length > 0 ? (
                    <Image
                        key={selectedIndex}
                        src={images[selectedIndex]}
                        alt={`Imagen ${selectedIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain transition-opacity duration-500 ease-in-out opacity-100"
                        quality={100}
                        unoptimized
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                        Sin imagen
                    </div>
                )}

                {/* Botón Izquierda */}
                <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                >
                    <FaChevronLeft size={18} />
                </button>

                {/* Botón Derecha */}
                <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                >
                    <FaChevronRight size={18} />
                </button>
            </div>

            {/* Miniaturas */}
            <div className="mt-2 flex justify-center gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-12 h-12 rounded-md overflow-hidden border transition-all duration-300
                            ${selectedIndex === idx
                                ? "border-gray-500 hover:border-gray-700"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
