//File: frontend/components/admin/products/ProductsFilters.tsx

"use client";

import { useRouter } from "next/navigation";
import { useColumnFilter } from "@/hooks/useColumnFilter";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import BarcodeFilterInput from "./BarcodeFilterInput";

import type { CategoryListResponse } from "@/src/schemas/category.schema";
import type { Brand } from "@/src/schemas/brand.schema";
/**
 * Props para el componente ProductsFilters
 */
interface ProductsFiltersProps {
    filters: {
        nombre?: string;
        sku?: string;
        barcode?: string;
        sort?: string;
        brand?: string;
        isActive?: string;
        category?: string;
    };
    brands: Brand[];
    categories: CategoryListResponse;
}

/**
 * ProductsFilters
 * 
 * Componente cliente que maneja todos los filtros de búsqueda.
 * Utiliza useColumnFilter para sincronizar valores con la URL.
 * 
 * Características:
 * - Inputs de texto para búsqueda (nombre, SKU, barcode)
 * - Selects para filtros múltiples (marca, categoría, estado, ordenamiento)
 * - Botón para limpiar todos los filtros
 * - Interfaz responsiva
 */
export default function ProductsFilters({
    filters,
    brands,
    categories,
}: ProductsFiltersProps) {
    const router = useRouter();

    /**
     * Inicializar hooks de filtro para cada campo
     * El hook useColumnFilter maneja la sincronización con URL
     */
    const nombreFilter = useColumnFilter("nombre", filters.nombre);
    const skuFilter = useColumnFilter("sku", filters.sku);
    const barcodeFilter = useColumnFilter("barcode", filters.barcode);
    const sortFilter = useColumnFilter("sort", filters.sort);
    const brandFilter = useColumnFilter("brand", filters.brand);
    const activeFilter = useColumnFilter("isActive", filters.isActive);
    const categoryFilter = useColumnFilter("category", filters.category);

    /**
     * Manejador para limpiar todos los filtros
     * Resetea los valores y vuelve a page 1
     */
    const handleClearFilters = () => {
        // Resetear todos los filtros
        nombreFilter.reset();
        skuFilter.reset();
        barcodeFilter.reset();
        sortFilter.reset();
        brandFilter.reset();
        activeFilter.reset();
        categoryFilter.reset();

        // Navegar a la página sin parámetros
        router.push("/admin/products?page=1&limit=10");
    };

    return (
        <div className="px-3 py-3 space-y-3 bg-muted/30 rounded-lg border border-border/40">
            {/* ═════════════════════════════════════════════════════════ */}
            {/* FILA 1: INPUTS DE BÚSQUEDA (Nombre, SKU, Barcode) */}
            {/* ═════════════════════════════════════════════════════════ */}
            <div className="flex gap-2 flex-wrap items-center">
                {/* Input: Búsqueda por nombre */}
                <Input
                    placeholder="Buscar por nombre…"
                    value={nombreFilter.value}
                    onChange={(e) => nombreFilter.setValue(e.target.value)}
                    className="flex-1 min-w-[150px] h-8 text-[13px]"
                    aria-label="Buscar productos por nombre"
                />

                {/* Input: Búsqueda por SKU */}
                <Input
                    placeholder="SKU"
                    value={skuFilter.value}
                    onChange={(e) => skuFilter.setValue(e.target.value)}
                    className="w-[130px] h-8 text-[13px]"
                    aria-label="Filtrar por SKU"
                />

                {/* Input especial: Barcode con integración de escáner */}
                <BarcodeFilterInput
                    value={barcodeFilter.value}
                    onChange={(val) => barcodeFilter.setValue(val)}
                />
            </div>

            {/* ═════════════════════════════════════════════════════════ */}
            {/* FILA 2: SELECTS DE FILTROS (Marca, Categoría, Estado, Orden) */}
            {/* ═════════════════════════════════════════════════════════ */}
            <div className="flex flex-wrap gap-2 items-center">
                {/* Select: Filtrar por Marca */}
                <Select
                    value={brandFilter.value || ""}
                    onValueChange={brandFilter.setValue}
                >
                    <SelectTrigger 
                        className="h-8 w-[140px] text-[13px]"
                        aria-label="Filtrar por marca"
                    >
                        <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map((b) => (
                            <SelectItem key={b._id} value={b._id}>
                                {b.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Select: Filtrar por Categoría */}
                <Select
                    value={categoryFilter.value || ""}
                    onValueChange={categoryFilter.setValue}
                >
                    <SelectTrigger 
                        className="h-8 w-[150px] text-[13px]"
                        aria-label="Filtrar por categoría"
                    >
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                                {c.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Select: Filtrar por Estado */}
                <Select
                    value={activeFilter.value || ""}
                    onValueChange={activeFilter.setValue}
                >
                    <SelectTrigger 
                        className="h-8 w-[120px] text-[13px]"
                        aria-label="Filtrar por estado"
                    >
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Activos</SelectItem>
                        <SelectItem value="false">Inactivos</SelectItem>
                    </SelectContent>
                </Select>

                {/* Select: Ordenamiento */}
                <Select
                    value={sortFilter.value || ""}
                    onValueChange={sortFilter.setValue}
                >
                    <SelectTrigger 
                        className="h-8 w-[160px] text-[13px]"
                        aria-label="Ordenar por"
                    >
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="precio-asc">Precio ↑ (Menor)</SelectItem>
                        <SelectItem value="precio-desc">Precio ↓ (Mayor)</SelectItem>
                        <SelectItem value="stock-asc">Stock ↑ (Menor)</SelectItem>
                        <SelectItem value="stock-desc">Stock ↓ (Mayor)</SelectItem>
                    </SelectContent>
                </Select>

                {/* Botón: Limpiar todos los filtros */}
                <button
                    onClick={handleClearFilters}
                    className="ml-auto text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded hover:bg-muted/40"
                    aria-label="Limpiar todos los filtros"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
}