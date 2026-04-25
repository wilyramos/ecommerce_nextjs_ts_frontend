// File: src/components/catalog/CatalogLayout.tsx
"use client";

import type { CatalogResponse } from "@/src/schemas/catalog";
import CatalogHeader, { TitlePart } from "./CatalogHeader";
import CatalogSidebar from "./CatalogSidebar";
import CatalogMobileFilters from "./CatalogMobileFilters";
import CatalogGrid from "./CatalogGrid";
import CatalogPagination from "./CatalogPagination";
import CatalogMobileSort from "./CatalogMobileSort";

interface CatalogLayoutProps {
    products: CatalogResponse['products'];
    filters: CatalogResponse['filters'];
    pagination: CatalogResponse['pagination'];
    context: CatalogResponse['context'];
    isFallback: boolean;
}

export default function CatalogLayout({
    products,
    filters,
    pagination,
    context,
    isFallback
}: CatalogLayoutProps) {

    // Title builder
    const getTitle = (): TitlePart[] => {
        if (context.searchQuery) {
            return [
                { text: "Resultados para" },
                { text: `"${context.searchQuery}"`, italic: true },
            ];
        }

        const parts: TitlePart[] = [];

        if (context.categoryName) {
            parts.push({ text: context.categoryName });
        }

        if (context.brandName) {
            parts.push({ text: context.brandName, italic: true });
        }

        if (context.lineName) {
            parts.push({ text: context.lineName, italic: true });
        }

        return parts.length > 0 ? parts : [{ text: "Catálogo" }];
    };

    // Breadcrumbs
    const breadcrumbs = [
        { label: "Inicio", href: "/" },
        { label: "Catálogo", href: "/catalogo" },
    ];

    if (context.categoryName) {
        breadcrumbs.push({ label: context.categoryName, href: "#" });
    }
    if (context.brandName) {
        breadcrumbs.push({ label: context.brandName, href: "#" });
    }
    if (context.lineName) {
        breadcrumbs.push({ label: context.lineName, href: "#" });
    }

    return (
        <section className="container mx-auto px-4 md:px-6 max-w-[1440px] pb-10">

            <div className="pt-4">
                <CatalogHeader
                    title={getTitle()}
                    totalProducts={pagination.totalItems}
                    breadcrumbs={breadcrumbs}
                />
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 relative">

                <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 md:pr-6 border-r">
                    <div className="sticky top-24">
                        <CatalogSidebar filters={filters} />
                    </div>
                </aside>

                <main className="lg:col-span-9 xl:col-span-10 flex flex-col">

                    <div className="lg:hidden flex items-center justify-between sticky top-11 z-10 bg-[var(--color-bg-primary)] py-2 border-b border-[var(--color-border-subtle)]">
                        <CatalogMobileFilters filters={filters} />
                        <CatalogMobileSort />
                    </div>

                    <CatalogGrid products={products} isFallback={isFallback} />

                    {!isFallback && pagination.totalPages > 1 && (
                        <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
                            <CatalogPagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                            />
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
}