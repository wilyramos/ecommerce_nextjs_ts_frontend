// File: frontend/components/collections/CollectionLayout.tsx
"use client";

import type { CatalogResponse } from "@/src/schemas/catalog";
import CollectionHero from "./CollectionHero";
import CollectionSidebar from "./Collectionsidebar";
import CatalogMobileFilters from "@/components/catalog/CatalogMobileFilters";
import CatalogMobileSort from "@/components/catalog/CatalogMobileSort";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import CatalogPagination from "@/components/catalog/CatalogPagination";

interface Props {
    products:   CatalogResponse["products"];
    filters:    CatalogResponse["filters"];
    pagination: CatalogResponse["pagination"];
    context:    CatalogResponse["context"];
    isFallback: boolean;
}

export default function CollectionLayout({
    products,
    filters,
    pagination,
    context,
    isFallback,
}: Props) {
    return (
        <>
            <CollectionHero context={context} />

            <section className="container mx-auto px-4 md:px-6 max-w-[1440px] pb-10 text-foreground bg-background">

                <div className="py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">
                        {pagination.totalItems === 0
                            ? "Sin productos en esta colección"
                            : `${pagination.totalItems} producto${pagination.totalItems !== 1 ? "s" : ""}`}
                    </p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 relative">

                    <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 md:pr-6 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
                        <div className="sticky top-24">
                            <CollectionSidebar filters={filters} />
                        </div>
                    </aside>

                    <main className="lg:col-span-9 xl:col-span-10 flex flex-col">

                        <div className="lg:hidden flex items-center justify-between sticky top-11 z-10 bg-background py-2 border-b border-border">
                            <CatalogMobileFilters filters={filters} />
                            <CatalogMobileSort />
                        </div>

                        <CatalogGrid products={products} isFallback={isFallback} />

                        {!isFallback && pagination.totalPages > 1 && (
                            <div className="mt-auto pt-8 border-t border-border">
                                <CatalogPagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </section>
        </>
    );
}