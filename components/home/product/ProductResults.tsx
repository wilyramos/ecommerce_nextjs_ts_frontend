// ProductResults.tsx
import { getProductsByFilter } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";

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
    limit = 10,
    sort,
    query,
}: ProductResultsProps) {
    const currentPage = page ? parseInt(page) : 1;

    const products = await getProductsByFilter({
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
        <>
            <ProductosList products={products} />
            <Pagination
                currentPage={products.currentPage}
                totalPages={products.totalPages}
                limit={limit}
                pathname="/productos" // solo la ruta
                queryParams={{
                    category,
                    priceRange,
                    sort,
                    query,
                }}
            />
        </>
    );
}
