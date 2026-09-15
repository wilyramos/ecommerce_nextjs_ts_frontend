// File: frontend/components/collections/CollectionLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { CatalogResponse } from "@/src/schemas/catalog";
import CollectionHero from "./CollectionHero";
import CollectionSidebar from "./Collectionsidebar";
import CollectionMobileFilters from "./CollectionMobileFilters";
import CatalogMobileSort from "@/components/catalog/CatalogMobileSort";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import CatalogPagination from "@/components/catalog/CatalogPagination";

interface Props {
    products: CatalogResponse["products"];
    filters: CatalogResponse["filters"];
    pagination: CatalogResponse["pagination"];
    context: CatalogResponse["context"];
    isFallback: boolean;
}

export default function CollectionLayout({ products, filters, pagination, context, isFallback }: Props) {
    const isEmpty = pagination.totalItems === 0;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 30) {
                setIsVisible(true);
            } else {
                if (currentScrollY > lastScrollY && currentScrollY > 150) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className="bg-surface-primary">
            <CollectionHero context={context} />

            <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16 pt-6">

                {/* Header de resultados */}
                <div className="py-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-text-secondary">
                        {isEmpty
                            ? "Sin productos"
                            : `${pagination.totalItems} producto${pagination.totalItems !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {isEmpty ? (
                    <div className="py-24 text-center rounded-[2rem] bg-surface-secondary/40">
                        <p className="text-base text-text-secondary">
                            No hay productos disponibles con los filtros seleccionados.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 relative">

                        {/* Sidebar Desktop */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-28 pr-4">
                                <CollectionSidebar filters={filters} />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:col-span-9 flex flex-col">

                            {/* Barra de Filtros Mobile Inteligente */}
                            <div
                                className={cn(
                                    "sticky z-10 flex items-center justify-between border-b border-border-primary/60 bg-surface-primary/95 py-2.5 -mx-4 px-4 backdrop-blur-md transition-all duration-300 ease-in-out lg:hidden",
                                    isVisible ? "top-14 translate-y-0 opacity-100" : "top-0 -translate-y-full opacity-0 pointer-events-none"
                                )}
                            >
                                <CollectionMobileFilters filters={filters} />
                                <CatalogMobileSort />
                            </div>

                            <div className="pt-3 lg:pt-0">
                                <CatalogGrid products={products} isFallback={isFallback} />
                            </div>

                            {!isFallback && pagination.totalPages > 1 && (
                                <div className="mt-12 pt-8 border-t border-border-primary/40">
                                    <CatalogPagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                    />
                                </div>
                            )}
                        </main>
                    </div>
                )}
            </section>
        </div>
    );
}