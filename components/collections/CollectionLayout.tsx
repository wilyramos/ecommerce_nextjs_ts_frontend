// File: frontend/components/collections/CollectionLayout.tsx
"use client";

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

                            {/* Filtros Mobile */}
                            <div className="lg:hidden flex items-center justify-between sticky top-16 z-20 bg-surface-primary/80 backdrop-blur-md py-3 -mx-4 px-4 border-b border-border-primary/40">
                                <CollectionMobileFilters filters={filters} />
                                <CatalogMobileSort />
                            </div>

                            <CatalogGrid products={products} isFallback={isFallback} />

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