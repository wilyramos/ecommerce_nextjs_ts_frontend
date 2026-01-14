import { getProductsMainPage } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";
import ProductsFiltersMain from "./ProductsFiltersMain";
import OrdenarPor from "../products/OrdenarPor";
import DrawerFiltersMain from "./DrawerFiltersMain";

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
            <div className="py-20 text-center text-[var(--store-text-muted)]">
                Error al cargar productos
            </div>
        );
    }

    const isFallback = products.totalProducts === 0;
    const hasProducts = products.products.length > 0;

    return (
        <main className="flex flex-col gap-4">
            {/* ===== NORMAL MODE ===== */}
            {!isFallback && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* Sidebar filtros */}
                    <aside className="hidden md:block md:col-span-1">
                        <div className="sticky top-24">
                            <ProductsFiltersMain
                                filters={products.filters || null}
                            />
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <section className="col-span-1 md:col-span-4 flex flex-col gap-3">

                        {/* Barra superior */}
                        <div className="flex justify-between md:justify-end items-center gap-2 text-sm border-b md:border-none sticky md:static top-12 py-1 bg-[var(--store-surface)] md:bg-transparent z-10">
                            <div className="md:hidden">
                                <DrawerFiltersMain filters={products?.filters || null} />
                            </div>

                            <OrdenarPor pathname="/productos" />
                        </div>

                        {/* Lista productos */}
                        {hasProducts && (
                            <>
                                <ProductosList products={products.products} />

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
                            </>
                        )}
                    </section>
                </div>
            )}

            {/* ===== FALLBACK MODE ===== */}
            {isFallback && (
                <section className="flex flex-col gap-6">

                    {/* Mensaje */}
                    <div className="text-center py-4 text-gray-500 text-sm">
                        No se encontraron productos con los filtros seleccionados.
                        <br />
                        Te recomendamos estos productos.
                    </div>

                    {/* Productos ocupan todo el ancho */}
                    {hasProducts && (
                        <div className="w-full">
                            <ProductosList
                                products={products.products}

                            />
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
