import { getProductsMainPage } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";
import ProductsFiltersMain from "./ProductsFiltersMain";

type ProductResultsProps = {
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: number;
    sort?: string;
    query?: string;
};

export default async function ProductResults({
    category,
    priceRange,
    page,
    limit = 24,
    sort,
    query,
}: ProductResultsProps) {
    const currentPage = page ? parseInt(page) : 1;

    const products = await getProductsMainPage({
        page: currentPage,
        limit,
        category: category || "",
        priceRange: priceRange || "",
        query: query || "",
        sort: sort || "",
    });

    if (!products || products.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No se encontraron productos con los filtros seleccionados.
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-6">
            {/* GRID principal: sidebar (filtros) + contenido */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                {/* Sidebar de filtros (desktop) */}
                <aside className="hidden md:block md:col-span-1">
                    <ProductsFiltersMain filters={products.filters} />
                </aside>

                {/* Contenido principal */}
                <section className="col-span-1 md:col-span-4 flex flex-col gap-6">
                    {/* Filtros solo en mobile */}
                    <div className="md:hidden">
                        <ProductsFiltersMain filters={products.filters} />
                    </div>

                    {/* Lista de productos */}
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
                        }}
                    />
                </section>
            </div>
        </main>
    );
}
