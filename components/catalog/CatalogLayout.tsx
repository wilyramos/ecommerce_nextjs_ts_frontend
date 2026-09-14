"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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

  const getTitle = (): TitlePart[] => {
    if (context.searchQuery) {
      return [
        { text: "Resultados para" },
        { text: `"${context.searchQuery}"`, italic: true },
      ];
    }
    const parts: TitlePart[] = [];
    if (context.categoryName) parts.push({ text: context.categoryName });
    if (context.brandName) parts.push({ text: context.brandName, italic: true });
    if (context.lineName) parts.push({ text: context.lineName, italic: true });
    return parts.length > 0 ? parts : [{ text: "Catálogo" }];
  };

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
  ];
  if (context.categoryName) breadcrumbs.push({ label: context.categoryName, href: "#" });
  if (context.brandName) breadcrumbs.push({ label: context.brandName, href: "#" });
  if (context.lineName) breadcrumbs.push({ label: context.lineName, href: "#" });

  return (
    <section className="text-text-primary">
      <div className="py-2 md:py-4">
        <CatalogHeader
          title={getTitle()}
          totalProducts={pagination.totalItems}
          breadcrumbs={breadcrumbs}
        />
      </div>

      <div className="relative flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8 pt-2">
        <aside className="hidden lg:col-span-3 lg:block xl:col-span-2">
          <div className="sticky top-28">
            <CatalogSidebar filters={filters} />
          </div>
        </aside>

        <main className="flex flex-col lg:col-span-9 xl:col-span-10">
          {/* Barra de Filtros Mobile Inteligente */}
          <div
            className={cn(
              "sticky z-10 flex items-center justify-between border-b border-border-primary/60 bg-surface-primary/95 py-2.5 backdrop-blur-md transition-all duration-300 ease-in-out lg:hidden",
              isVisible ? "top-14 translate-y-0 opacity-100" : "top-0 -translate-y-full opacity-0 pointer-events-none"
            )}
          >
            <CatalogMobileFilters filters={filters} />
            <CatalogMobileSort />
          </div>

          <div className="pt-3 lg:pt-0">
            <CatalogGrid products={products} isFallback={isFallback} />
          </div>

          {!isFallback && pagination.totalPages > 1 && (
            <div className="mt-8 border-t border-border-primary/80 pt-8">
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