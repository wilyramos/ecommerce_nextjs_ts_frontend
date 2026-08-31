// File: frontend/app/(store)/comparativas/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Layers, Image as ImageIcon } from "lucide-react";

import { comparisonService } from "@/src/services/comparison-service";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import Pagination from "@/components/ui/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "Comparativas de Productos | Guías y Análisis Frente a Frente",
    description:
        "Analizamos y comparamos características, especificaciones y rendimiento de productos para ayudarte a elegir la mejor opción.",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>;
}

export default async function StoreComparisonsIndexPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 9));
    const search = params.search?.trim() || "";

    const { items, meta } = await comparisonService.getAllPublic({
        page,
        limit,
        search,
    });

    const currentPage: number = meta?.page ?? page;
    const totalPages: number = meta?.pages ?? 1;
    const currentLimit: number = meta?.limit ?? limit;

    return (
        <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* ── HEADER PÚBLICO ── */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        <span>Frente a Frente</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Comparativas de Productos
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Compara especificaciones técnicas, diferencias clave y el veredicto definitivo de expertos antes de realizar tu compra.
                    </p>
                </div>

                {/* ── GRID DE COMPARATIVAS ── */}
                {items.length === 0 ? (
                    <div className="text-center py-20 border border-dashed rounded-2xl bg-card">
                        <Layers className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                        <h2 className="text-base font-semibold text-foreground">No hay comparativas disponibles</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Vuelve a consultar más adelante o prueba con otra búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((comparison) => {
                            const products = comparison.products.filter(
                                (p): p is ProductSearchResult => typeof p === "object" && p !== null
                            );

                            return (
                                <Card
                                    key={comparison._id}
                                    className="group flex flex-col overflow-hidden border-border/70 hover:border-primary/50 transition-all hover:shadow-md bg-card"
                                >
                                    {/* Miniaturas de los productos enfrentados */}
                                    <div className="relative h-44 bg-muted/40 p-4 flex items-center justify-around border-b border-border/40">
                                        {comparison.isFeatured && (
                                            <Badge className="absolute top-3 left-3 bg-amber-500 text-white hover:bg-amber-600 border-none text-[10px] font-bold">
                                                Destacado
                                            </Badge>
                                        )}

                                        {products.slice(0, 2).map((product, idx) => (
                                            <React.Fragment key={product._id || idx}>
                                                <div className="flex flex-col items-center gap-1.5 z-10">
                                                    <div className="relative h-24 w-24 rounded-xl bg-white border border-border/80 shadow-xs overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                        {product.imagenes?.[0] ? (
                                                            <Image
                                                                src={product.imagenes[0]}
                                                                alt={product.nombre}
                                                                fill
                                                                sizes="96px"
                                                                className="object-contain p-2"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-center truncate max-w-[110px]">
                                                        {product.nombre}
                                                    </span>
                                                </div>

                                                {idx === 0 && products.length > 1 && (
                                                    <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full bg-background border border-border shadow-xs font-extrabold text-[11px] text-muted-foreground">
                                                        VS
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Contenido descriptivo */}
                                    <CardContent className="flex-1 flex flex-col justify-between p-5 space-y-4">
                                        <div className="space-y-2">
                                            <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {comparison.title}
                                            </h2>
                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                {comparison.veredictoRapido}
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                {comparison.especificaciones.length} criterios analizados
                                            </span>
                                            <Link
                                                href={`/comparativas/${comparison.slug}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                            >
                                                Ver Análisis <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* ── PAGINACIÓN ── */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={currentLimit}
                        pathname="/comparativas"
                    />
                )}
            </div>
        </div>
    );
}