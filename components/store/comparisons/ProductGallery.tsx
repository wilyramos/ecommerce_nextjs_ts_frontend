// File: frontend/components/store/comparisons/ProductGallery.tsx
"use client";

import Image from "next/image";
import { PopulatedProduct } from "@/src/schemas/comparison.schema";

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
                <div key={p._id} className="flex flex-col items-center gap-3 p-4 border border-border rounded-xl bg-card">
                    {p.imagenes?.[0] ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted-neutral">
                            <Image
                                src={p.imagenes[0]}
                                alt={p.nombre}
                                fill
                                className="object-contain p-2"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-square rounded-lg bg-muted-neutral flex items-center justify-center text-muted-foreground text-xs">
                            Sin imagen
                        </div>
                    )}
                    <p className="text-sm font-semibold text-center line-clamp-2 text-foreground">{p.nombre}</p>
                    {p.precio !== undefined && (
                        <p className="text-base font-bold text-primary">
                            S/ {Number(p.precio).toLocaleString("es-PE")}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}