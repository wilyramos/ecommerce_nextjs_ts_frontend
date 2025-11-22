"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
        setZoom(false);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoom(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoom) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    const toggleZoom = () => setZoom((prev) => !prev);

    const showThumbnails = images.length > 1;

    return (
        <div className="w-full max-w-sm md:max-w-3xl mx-auto flex flex-col md:flex-row gap-3">

            {showThumbnails && (
                <div className="hidden md:flex flex-col gap-2 overflow-y-auto no-scrollbar w-20">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all duration-300
                ${selectedIndex === idx ? "border-gray-500 hover:border-gray-700" : "border-gray-200 hover:border-gray-400"}`}
                        >
                            <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" quality={1} unoptimized />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1">
                <div
                    className={`relative aspect-square overflow-hidden bg-white
            ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    onMouseMove={handleMouseMove}
                    onClick={toggleZoom}
                >
                    {images.length > 0 ? (
                        <Image
                            key={selectedIndex}
                            src={images[selectedIndex]}
                            alt={`Imagen ${selectedIndex + 1}`}
                            fill
                            className={`object-contain transition duration-300 ${zoom ? "scale-150" : "scale-100"}`}
                            style={{ transformOrigin: `${position.x}% ${position.y}%` }}
                            quality={100}
                            unoptimized
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}

                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 -translate-y-1/2 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-md"
                        >
                            <FaChevronLeft size={18} />
                        </button>
                    )}

                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-4 -translate-y-1/2 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-md"
                        >
                            <FaChevronRight size={18} />
                        </button>
                    )}
                </div>

                {showThumbnails && (
                    <div className="mt-2 flex md:hidden justify-center gap-2 overflow-x-auto no-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative h-8 w-8 md:h-12 md:w-12 rounded-md overflow-hidden border-2 transition-all duration-300
                  ${selectedIndex === idx ? "border-gray-500 hover:border-gray-700" : "border-gray-200 hover:border-gray-400"}`}
                            >
                                <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" quality={1} unoptimized />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}