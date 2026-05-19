// File: frontend/components/store/comparisons/ProductGallery.tsx

import Image from "next/image";
import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { Badge } from "@/components/ui/badge";

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

    // Calcula número de columnas dinámicamente
    const cols =
        populated.length === 2
            ? "grid-cols-2"
            : populated.length === 3
            ? "grid-cols-3"
            : "grid-cols-2 sm:grid-cols-4";

    return (
        <div className={`grid ${cols} gap-px overflow-hidden flex items-center justify-center`}>
            {populated.map(({ idx, nombre, imagen, precio }) => (
                <div
                    key={idx}
                    className="flex flex-col items-center gap-4  p-6 md:p-8 group"
                >
                    {/* Imagen */}
                    <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                        <Image
                            src={imagen!}
                            alt={nombre}
                            width={320}
                            height={320}
                            unoptimized
                            priority={idx < 2}
                            className="object-contain w-full h-full drop-shadow-sm"
                        />
                    </div>

                    {/* Nombre */}
                    <p className="text-sm font-semibold text-foreground text-center leading-snug line-clamp-2 max-w-[160px]">
                        {nombre}
                    </p>

                    {/* Precio */}
                    {precio !== null && precio !== undefined && (
                        <Badge variant="secondary" className="font-mono text-xs font-semibold">
                            {typeof precio === "number"
                                ? precio.toLocaleString("es-PE", {
                                      style: "currency",
                                      currency: "PEN",
                                      maximumFractionDigits: 0,
                                  })
                                : precio}
                        </Badge>
                    )}
                </div>
            ))}
        </div>
    );
}