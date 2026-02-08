// File: src/components/catalog/CatalogLayout.tsx
"use client";

import type { CatalogResponse } from "@/src/schemas/catalog";
import CatalogHeader from "./CatalogHeader";
import CatalogSidebar from "./CatalogSidebar";
import CatalogMobileFilters from "./CatalogMobileFilters";
import CatalogGrid from "./CatalogGrid";
import CatalogPagination from "./CatalogPagination";

// Definimos las props basándonos en la respuesta de la API
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

    // --- 1. Generar Título SEO/Visual Dinámico ---
    const getTitle = () => {
        // Caso A: Búsqueda por texto (prioridad alta)
        if (context.searchQuery) return `Resultados para "${context.searchQuery}"`;

        // Caso B: Navegación jerárquica (Ej: "Celulares Samsung Galaxy S")
        const parts = [];
        if (context.categoryName) parts.push(context.categoryName);
        if (context.brandName) parts.push(context.brandName);
        if (context.lineName) parts.push(context.lineName); // <--- Incluimos la línea

        return parts.length > 0 ? parts.join(" ") : "Catálogo";
    };

    // --- 2. Generar Breadcrumbs ---
    // Nota: Usamos href="#" para indicar la posición actual o jerarquía. 
    // El componente CatalogHeader renderiza estos elementos como texto no clicable (span)
    // para evitar recargas innecesarias, ya que la navegación real se hace vía Sidebar.
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
        <div className="container mx-auto px-4 md:px-6 max-w-[1440px] pb-20">
            
            {/* Header Global (Título + Breadcrumbs + Contador Total) */}
            <div className="pt-8">
                <CatalogHeader 
                    title={getTitle()} 
                    totalProducts={pagination.totalItems}
                    breadcrumbs={breadcrumbs}
                />
            </div>

            {/* Layout Principal (Grid 12 columnas) */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 mt-8 relative">
                
                {/* --- SIDEBAR (Desktop) --- */}
                {/* Oculto en móvil, visible en lg (col-span-3 o 2 dependiendo del diseño) */}
                <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
                    <div className="sticky top-24">
                        {/* Pasamos TODOS los filtros (incluyendo líneas) */}
                        <CatalogSidebar filters={filters} />
                    </div>
                </aside>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <main className="lg:col-span-9 xl:col-span-10 flex flex-col gap-8">
                    
                    {/* Toolbar Mobile (Contador + Botón Filtros Drawer) */}
                    {/* Solo visible en pantallas pequeñas */}
                    <div className="lg:hidden flex justify-between items-center sticky top-12 z-20 bg-[var(--store-bg)] py-2">
                        <span className="text-sm font-medium text-[var(--store-text-muted)]">
                            {pagination.totalItems} {pagination.totalItems === 1 ? 'Producto' : 'Productos'}
                        </span>
                        
                        {/* Pasamos los filtros al Drawer móvil */}
                        <CatalogMobileFilters filters={filters} />
                    </div>

                    {/* Grid de Productos (o Mensaje de Fallback si no hay exactos) */}
                    <CatalogGrid products={products} isFallback={isFallback} />

                    {/* Paginación */}
                    {/* Solo se muestra si NO estamos en modo fallback y hay más de 1 página */}
                    {!isFallback && pagination.totalPages > 1 && (
                        <div className="mt-auto pt-8 border-t border-[var(--store-border)]">
                            <CatalogPagination 
                                currentPage={pagination.currentPage} 
                                totalPages={pagination.totalPages} 
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}