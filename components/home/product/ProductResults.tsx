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
    const currentPage = page ? parseInt(page) : 1;

    const products = await getProductsMainPage({
        page: currentPage,
        limit: limit,
        category: category || "",
        priceRange: priceRange || "",
        query: query || "",
        sort: sort || "",
        ...rest,
    });

    return (
        <main className="flex flex-col gap-3">
            {/* GRID principal: sidebar (filtros) + contenido */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                {/* Sidebar de filtros (desktop) */}
                <aside className="hidden md:block md:col-span-1">
                    <div className="sticky top-15">
                        <ProductsFiltersMain filters={products?.filters || null} />
                    </div>
                </aside>

                {/* Contenido principal */}
                <section className="col-span-1 md:col-span-4 flex flex-col gap-2">
                    {/* Barra superior (mobile + desktop) */}
                    <div className="flex justify-between md:justify-end items-center gap-2 text-sm  border-b md:border-none sticky md:static top-15 bg-white md:bg-transparent z-10">
                        {/* Drawer solo en mobile */}
                        <div className="md:hidden">
                            <DrawerFiltersMain filters={products?.filters || null} />
                        </div>

                        <OrdenarPor pathname="/productos" />
                    </div>

                    {/* Lista de productos */}
                    {products && products.products.length > 0 ? (
                        <>
                            <ProductosList products={products.products} />

                            {/* Paginación */}
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
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No se encontraron productos.
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}