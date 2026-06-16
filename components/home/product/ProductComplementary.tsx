// File: frontend/components/home/product/ProductComplementary.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { H3 } from '@/components/ui/Typography';
import type { ProductWithCategoryResponse } from '@/src/schemas';

type ProductComplementaryProps = {
    complementarios: ProductWithCategoryResponse['complementarios'];
};

export default function ProductComplementary({ complementarios }: ProductComplementaryProps) {
    if (!complementarios || complementarios.length === 0) return null;

    return (
        <section className="">
            <div className="space-y-3">
                <H3 className="text-xs uppercase tracking-wider text-muted-foreground select-none">
                    Completa tu compra
                </H3>

                <div className="flex flex-wrap gap-3">
                    {complementarios.map((comp) => {
                        const isPopulated = typeof comp !== 'string';
                        if (!isPopulated) return null;

                        return (
                            <Link
                                key={comp._id}
                                href={`/productos/${comp.slug}`}
                                className="group flex-1 min-w-[150px] max-w-[240px] flex flex-col gap-3 p-3 transition-colors border border-border bg-card hover:border-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="relative aspect-square overflow-hidden bg-background-secondary flex items-center justify-center p-2 select-none">
                                    <Image
                                        src={comp.imagenes?.[0] || "/logo.png"}
                                        alt={comp.nombre}
                                        fill
                                        className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                                        unoptimized
                                    />
                                </div>

                                <div className="space-y-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground leading-snug truncate">
                                        {comp.nombre}
                                    </p>
                                    <p className="text-xs font-semibold text-foreground select-all">
                                        S/ {comp.precio.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}