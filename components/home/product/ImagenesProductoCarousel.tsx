"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImagenesProductoCarousel({ images }: { images: string[] }) {

    // 1. Lógica de deduplicación: Crea un array de URLs únicas
    const uniqueImages = useMemo(() => {
        if (!images) return [];
        return Array.from(new Set(images));
    }, [images]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragEnd, setDragEnd] = useState<number | null>(null);

    // 2. Resetear el índice si las imágenes cambian drásticamente 
    // (opcional, pero recomendado al cambiar de variante)
    useEffect(() => {
        if (selectedIndex >= uniqueImages.length) {
            setSelectedIndex(0);
        }
    }, [uniqueImages, selectedIndex]);

    // Usamos uniqueImages en lugar de images en todas las funciones
    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % uniqueImages.length);
        setZoom(false);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
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

    const onDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setDragStart(clientX);
    };

    const onDragMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (dragStart === null) return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        setDragEnd(clientX);
    };

    const onDragEnd = () => {
        if (dragStart === null || dragEnd === null) {
            setDragStart(null);
            setDragEnd(null);
            return;
        }

        const diff = dragStart - dragEnd;

        // Sensibilidad del swipe
        if (diff > 50) nextImage();
        if (diff < -50) prevImage();

        setDragStart(null);
        setDragEnd(null);
    };

    const showThumbnails = uniqueImages.length > 1;

    // Si no hay imágenes únicas, no renderizamos nada o un placeholder
    if (uniqueImages.length === 0) {
        return (
            <div className="w-full max-w-sm md:max-w-3xl mx-auto aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                Sin imágenes
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm md:max-w-3xl mx-auto flex flex-col md:flex-row gap-3 bg-white">

            {showThumbnails && (
                <div
                    className="
      hidden md:flex 
      flex-col 
      gap-2 
      overflow-y-auto 
      overflow-x-hidden 
      no-scrollbar 
      w-20 
      md:p-2 
      sticky 
      top-30 
      h-full 
      max-h-[500px]
    "
                >
                    {uniqueImages.map((img, idx) => (
                        <button
                            key={img}
                            onClick={() => setSelectedIndex(idx)}
                            className={`
          relative 
          h-16 
          w-16 
          flex-none
          rounded-md 
          overflow-hidden 
          border-2 
          transition-all 
          duration-300
          ${selectedIndex === idx
                                    ? "border-gray-800 opacity-100 ring-1 ring-gray-800"
                                    : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"}
        `}
                        >
                            <Image
                                src={img}
                                alt={`Vista ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                                quality={20}
                            />
                        </button>
                    ))}
                </div>
            )}


            <div className="flex-1 relative">
                <div
                    className={`relative aspect-square overflow-hidden bg-white rounded-lg select-none
                        ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    onMouseMove={handleMouseMove}
                    onClick={toggleZoom}
                    onMouseDown={onDragStart}
                    onMouseMoveCapture={onDragMove}
                    onMouseUp={onDragEnd}
                    onMouseLeave={onDragEnd} // Importante para cancelar drag si sale
                    onTouchStart={onDragStart}
                    onTouchMove={onDragMove}
                    onTouchEnd={onDragEnd}
                >
                    <Image
                        key={uniqueImages[selectedIndex]} // Key para forzar re-render suave al cambiar
                        src={uniqueImages[selectedIndex]}
                        alt="Producto principal"
                        fill
                        className={`object-contain transition-transform duration-200 ease-out 
                            ${zoom ? "scale-[2]" : "scale-100"}`} // Zoom aumentado a 2x
                        style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
                        quality={90}
                        priority // Carga prioritaria para la imagen principal
                    />

                    {uniqueImages.length > 1 && !zoom && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute top-1/2 left-1 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                                aria-label="Imagen anterior"
                            >
                                <FaChevronLeft size={16} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute top-1/2 right-1 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                                aria-label="Siguiente imagen"
                            >
                                <FaChevronRight size={16} />
                            </button>
                        </>
                    )}
                </div>

                {/* Miniaturas Móviles (Debajo) */}
                {showThumbnails && (
                    <div className="mt-3 flex md:hidden justify-center gap-2 overflow-x-auto no-scrollbar px-2">
                        {uniqueImages.map((img, idx) => (
                            <button
                                key={img}
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative h-10 w-10 rounded-md overflow-hidden border-2 transition-all flex-shrink-0
                                    ${selectedIndex === idx ? "border-gray-800 ring-1 ring-gray-800" : "border-gray-200 opacity-70"}`}
                            >
                                <Image src={img} alt="Thumb" fill className="object-contain" sizes="48px" quality={5} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}