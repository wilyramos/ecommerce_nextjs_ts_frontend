// frontend/components/home/product/ProductComplementary.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { H3 } from '@/components/ui/Typography';
import { ChevronRight } from 'lucide-react';
import type { TComplementaryProduct, ProductWithCategoryResponse } from '@/src/schemas';

type ProductComplementaryProps = {
    complementarios: ProductWithCategoryResponse['complementarios'];
};

export default function ProductComplementary({ complementarios }: ProductComplementaryProps) {
    // Filtrar defensivamente por si llega un ID sin populación completa desde la API
    const validComplements = (complementarios ?? []).filter(
        (comp): comp is TComplementaryProduct => typeof comp === 'object' && comp !== null && '_id' in comp
    );

    if (validComplements.length === 0) return null;

    return (
        <section className="mt-4 border-t border-border/40 pt-4">
            <div className="space-y-3">
                <H3 className="text-[10px] uppercase tracking-wider text-muted-foreground select-none font-bold">
                    Completa tu compra
                </H3>

                <div className="flex flex-col gap-2">
                    {validComplements.map((comp) => {
                        const mainImage = comp.imagenes?.[0] || "/logogophone.png";

                        return (
                            <Link
                                key={comp._id}
                                href={`/productos/${comp.slug}`}
                                className="group flex items-center justify-between gap-3 p-2.5 border border-border hover:border-muted-foreground/60 transition-colors outline-none rounded-xs focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Contenedor de Imagen */}
                                    <div className="relative w-12 h-12 y flex items-center justify-center p-1 shrink-0 rounded-xs overflow-hidden select-none">
                                        <Image
                                            src={mainImage}
                                            alt={comp.nombre}
                                            fill
                                            className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                                            sizes="48px"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Información del Producto */}
                                    <div className="min-w-0 space-y-0.5">
                                        <h4 className="text-xs font-semibold text-foreground leading-snug truncate group-hover:text-action-cta transition-colors">
                                            {comp.nombre}
                                        </h4>
                                        <p className="text-xs font-medium text-muted-foreground select-all">
                                            S/ {comp.precio.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Indicador de Acción */}
                                <div className="text-muted-foreground group-hover:text-action-cta group-hover:translate-x-0.5 transition-all shrink-0">
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}