"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardImageProps {
    imagenes: string[];
    nombre: string;
}

export default function ProductCardImage({ imagenes, nombre }: ProductCardImageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    };

    if (!imagenes.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-xs">Sin imagen</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden group/image">
            {/* Track de imágenes */}
            <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {imagenes.map((img, idx) => (
                    <div key={idx} className="min-w-full h-full relative">
                        <Image
                            src={img}
                            alt={`${nombre} ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover"
                            priority={idx === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Navegación - Solo visible en hover */}
            {imagenes.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={16} />
                    </button>
                    {/* Indicadores */}
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
                        {imagenes.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all ${idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}