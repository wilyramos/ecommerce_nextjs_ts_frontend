import { getProductsMainPage } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";
import ProductsFiltersMain from "./ProductsFiltersMain";
import OrdenarPor from "../products/OrdenarPor";
import DrawerFiltersMain from "./DrawerFiltersMain";
import ActiveFiltersChips from "../products/ActiveFiltersChips";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type ProductResultsProps = {
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: number;
    sort?: string;
    query?: string;
} & Record<string, string | string[] | undefined | number>;

export default async function ProductResults({
    category,
    priceRange,
    page,
    limit = 24,
    sort,
    query,
    ...rest
}: ProductResultsProps) {
    const currentPage = page ? parseInt(page, 10) : 1;

    const products = await getProductsMainPage({
        page: currentPage,
        limit,
        category: category || "",
        priceRange: priceRange || "",
        query: query || "",
        sort: sort || "",
        ...rest,
    });

    if (!products) {
        return (
            <div className="py-24 text-center text-[var(--store-text-muted)]">
                Error al cargar productos
            </div>
        );
    }

    const isFallback = products.totalProducts === 0;
    const hasProducts = products.products.length > 0;
    return (
        <main className="flex flex-col gap-2">
            <div className="pt-1">
                <Breadcrumbs current="Productos" />
            </div>

            {!isFallback && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">

                    {/* SIDEBAR + HEADER (desktop) centrado */}
                    <aside className="hidden md:block md:col-span-1 p-2">
                        <div className="flex flex-col gap-3 pb-2">
                            <header className="flex flex-col gap-1">
                                <h1 className="text-xl md:text-2xl font-medium text-[var(--store-text)] leading-tight">
                                    {query ? `Resultados para "${query}"` : "Todos los productos"}
                                </h1>

                                <span className="text-xs text-[var(--store-text-muted)]">
                                    Mostrando {products.products.length} de {products.totalProducts} productos
                                </span>

                                <div className="min-h-[28px]">
                                    <ActiveFiltersChips />
                                </div>
                            </header>
                        </div>

                        <div className="sticky top-24 ">
                            <ProductsFiltersMain filters={products.filters || null} />
                        </div>
                    </aside>

                    {/* CONTENIDO PRINCIPAL */}
                    <section className="col-span-1 md:col-span-4 flex flex-col  p-2">

                        {/* Header MOBILE */}
                        <div className="md:hidden px-1 ">
                            <header className="flex flex-col gap-1">
                                <h1 className="text-xl font-medium text-[var(--store-text)] leading-tight">
                                    {query ? `Resultados para "${query}"` : "Todos los productos"}
                                </h1>

                                <span className="text-xs text-[var(--store-text-muted)]">
                                    Mostrando {products.products.length} de {products.totalProducts} productos
                                </span>

                                <div className="min-h-[28px]">
                                    <ActiveFiltersChips />
                                </div>
                            </header>
                        </div>

                        {/* Barra superior */}
                        <div
                            className="
                            flex justify-between md:justify-end items-center
                            gap-2 text-sm border-b md:border-none
                            sticky md:static top-12
                            py-2 md:py-1
                            bg-[var(--store-surface)] md:bg-transparent
                            z-10
                        "
                        >
                            <div className="md:hidden">
                                <DrawerFiltersMain filters={products?.filters || null} />
                            </div>

                            <div className="flex items-center gap-2">
                                <OrdenarPor pathname="/productos" />
                            </div>
                        </div>

                        {hasProducts && (
                            <div className="flex flex-col gap-5">
                                <ProductosList products={products.products} />

                                <div className="pt-1">
                                    <Pagination
                                        currentPage={products.currentPage}
                                        totalPages={products.totalPages}
                                        limit={limit}
                                        pathname="/productos"
                                        queryParams={{
                                            category,
                                            priceRange,
                                            sort,
                                            query,
                                            ...rest,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {isFallback && (
                <section className="flex flex-col gap-6 pt-3">
                    <div className="text-center py-6 text-[var(--store-text-muted)] text-sm">
                        No se encontraron productos con los filtros seleccionados.
                        <br />
                        Prueba cambiando los criterios de búsqueda.
                    </div>

                    {hasProducts && (
                        <div className="w-full">
                            <ProductosList products={products.products} />
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
