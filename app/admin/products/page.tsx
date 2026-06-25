// File: frontend/app/admin/products/page.tsx

import { getProductsByAdmin } from "@/src/services/products";
import { getAllSubcategories } from "@/src/services/categorys";
import { getBrands } from "@/src/services/brands";

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductsFilters from "@/components/admin/products/ProductsFilters";
import ProductsTable from "@/components/admin/products/ProductsTable";
import PaginationBanner from "@/components/ui/PaginationBanner";

/**
 * SearchParams interface - Define todos los parámetros de búsqueda posibles
 */
interface SearchParams {
    page?: string;
    limit?: string;
    nombre?: string;
    sku?: string;
    barcode?: string;
    sort?: string;
    brand?: string;
    isActive?: string;
    category?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

/**
 * ProductsPage
 * * Página admin de productos con:
 * - Validación centralizada de parámetros
 * - Fetches en paralelo
 * - Estructura limpia y mantenible con paginación avanzada estilo Shopify
 */
export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    /**
     * ────────────────────────────────────────────────────────────────
     * 1. VALIDAR Y NORMALIZAR PARÁMETROS
     * ────────────────────────────────────────────────────────────────
     * * Esto centraliza toda la lógica de validación en un solo lugar
     * evitando que los parámetros inválidos se pasen al servicio o UI
     */

    // Validar page y limit
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Math.min(Number(params.limit ?? 10), 100));

    // Normalizar strings de búsqueda (trim + undefined si vacío)
    const nombre = params.nombre?.trim() || undefined;
    const sku = params.sku?.trim() || undefined;
    const barcode = params.barcode?.trim() || undefined;
    const brand = params.brand?.trim() || undefined;
    const category = params.category?.trim() || undefined;

    /**
     * Parsear sort parameter
     * Formato esperado: "precio-asc" | "precio-desc" | "stock-asc" | "stock-desc"
     */
    let precioSort: "asc" | "desc" | undefined = undefined;
    let stockSort: "asc" | "desc" | undefined = undefined;

    if (params.sort) {
        const [field, direction] = params.sort.split("-") as [string, "asc" | "desc"];

        if (field === "precio" && ["asc", "desc"].includes(direction)) {
            precioSort = direction;
        } else if (field === "stock" && ["asc", "desc"].includes(direction)) {
            stockSort = direction;
        }
    }

    /**
     * Parsear isActive boolean flag
     */
    const isActive =
        params.isActive === "true"
            ? true
            : params.isActive === "false"
                ? false
                : undefined;

    /**
     * ────────────────────────────────────────────────────────────────
     * 2. HACER FETCHES EN PARALELO
     * ────────────────────────────────────────────────────────────────
     * * Promise.all() ejecuta los 3 requests simultáneamente
     * Esto es mucho más rápido que hacerlos secuencialmente
     */
    const [productsData, categories, brands] = await Promise.all([
        // Request 1: Productos filtrados
        getProductsByAdmin({
            page,
            limit,
            nombre,
            sku,
            barcode,
            precioSort,
            stockSort,
            brand,
            isActive,
            category,
        }),

        // Request 2: Categorías (para filtros)
        getAllSubcategories(),

        // Request 3: Marcas (para filtros)
        getBrands(),
    ]);

    /**
     * ────────────────────────────────────────────────────────────────
     * 3. CALCULAR VALORES PARA PAGINACIÓN
     * ────────────────────────────────────────────────────────────────
     */
    const totalProducts = productsData?.totalProducts ?? 0;
    const totalPages = productsData?.totalPages ?? 1;
    const productsToShow = productsData?.products ?? [];

    /**
     * ────────────────────────────────────────────────────────────────
     * 4. RENDERIZAR
     * ────────────────────────────────────────────────────────────────
     */
    return (
        <AdminPageWrapper
            title="Productos"
            breadcrumbCurrent="Productos"
            showBackButton={false}
            actions={<AddProductButton />}
        >
            <div className="space-y-5">
                {/* Componente de Filtros */}
                <ProductsFilters
                    filters={{
                        nombre: params.nombre,
                        sku: params.sku,
                        barcode: params.barcode,
                        sort: params.sort,
                        brand: params.brand,
                        isActive: params.isActive,
                        category: params.category,
                    }}
                    brands={brands}
                    categories={categories}
                />

                {/* Tabla de Productos */}
                <ProductsTable products={productsToShow} />

                {/* Banner de Paginación Avanzada */}
                <PaginationBanner
                    currentPage={page}
                    totalPages={totalPages}
                    limit={limit}
                    totalItems={totalProducts}
                    itemsShown={productsToShow.length}
                    pathname="/admin/products"
                    limitOptions={[10, 25, 50, 100]}
                />
            </div>
        </AdminPageWrapper>
    );
}