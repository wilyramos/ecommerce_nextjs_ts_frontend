// File: frontend/components/store/comparisons/ProductGallery.tsx

"use client";

import Image from "next/image";
import { PopulatedProduct } from "@/src/schemas/comparison.schema";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { P, Price } from "@/components/ui/TypographyStore";

interface Props {
    products: (string | PopulatedProduct)[];
}

export default function ProductGallery({ products }: Props) {
    const populated = products.filter(
        (p): p is PopulatedProduct => typeof p === "object"
    );
    if (!populated.length) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {populated.map((p) => (
                <div key={p._id} className="flex flex-col items-center gap-3 p-4 border border-border bg-card">
                    {p.imagenes?.[0] ? (
                        <div className="relative w-full aspect-square overflow-hidden bg-muted/20">
                            <Image
                                src={p.imagenes[0]}
                                alt={p.nombre}
                                fill
                                className="object-contain p-2"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-square bg-muted/20 flex items-center justify-center text-muted-foreground">
                            <MdOutlineImageNotSupported size={20} />
                        </div>
                    )}
                    <P className="text-xs sm:text-sm font-medium text-center line-clamp-2">{p.nombre}</P>
                    {p.precio !== undefined && (
                        <Price className="text-sm font-semibold">
                            S/ {Number(p.precio).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Price>
                    )}
                </div>
            ))}
        </div>
    );
}