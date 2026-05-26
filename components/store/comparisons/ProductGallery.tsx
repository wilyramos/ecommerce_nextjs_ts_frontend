import Image from "next/image";
import React from "react";
import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";

interface ProductGalleryProps {
    products: Comparison["products"];
}

export default function ProductGallery({ products }: ProductGalleryProps) {
    if (!products || products.length === 0) return null;

    const populated = products
        .map((p, idx) => {
            const isObject = typeof p === "object" && p !== null;
            const prod = isObject ? (p as PopulatedProduct) : null;
            return {
                idx,
                nombre: prod?.nombre ?? `Producto ${idx + 1}`,
                imagen: prod?.imagenes?.[0] ?? null,
                precio: prod?.precio ?? null,
            };
        })
        .filter((p) => p.imagen !== null);

    if (populated.length === 0) return null;

    return (
        <div className="relative flex flex-row items-center justify-center gap-4 w-full overflow-hidden">
            {populated.map(({ idx, nombre, imagen, precio }, currentIdx) => (
                <React.Fragment key={idx}>
                    <div className="flex-1 flex flex-col items-center gap-4 p-6 md:p-8 group w-full">
                        {/* Imagen - max-w incrementado de 180px a 280px */}
                        <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                            <Image
                                src={imagen!}
                                alt={nombre}
                                width={400}
                                height={400}
                                unoptimized
                                priority={idx < 2}
                                className="object-contain w-full h-full"
                            />
                        </div>

                        {/* Nombre - max-w incrementado para acompañar el tamaño de imagen */}
                        <p className="text-sm font-semibold text-foreground text-center leading-snug line-clamp-3 max-w-[220px]">
                            {nombre}
                        </p>

                        {/* Precio */}
                        {precio !== null && precio !== undefined && (
                            <p className="text-sm font-bold text-action-cta">
                                {precio.toLocaleString("es-PE", {
                                    style: "currency",
                                    currency: "PEN",
                                    maximumFractionDigits: 0,
                                })}
                            </p>
                        )}
                    </div>

                    {/* Divisor VS absoluto/intermedio si hay un siguiente producto */}
                    {currentIdx < populated.length - 1 && (
                        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-background border border-border rounded-full w-10 h-10  pointer-events-none">
                            <span className="text-xs font-bold text-muted-foreground italic">VS</span>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}