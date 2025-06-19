import { getProductsByFilter } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";


type ProductResultsProps = {
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: number;
    sort?: string;
    compatibilidad?: string;
    query?: string;
};

export default async function ProductResults({ category, priceRange, page, limit = 10, sort, compatibilidad, query }: ProductResultsProps) {

    const products = await getProductsByFilter({
        page: page ? parseInt(page) : 1,
        limit,
        category: category || "",
        priceRange: priceRange || "",
        query: query || "",
        sort: sort || "",
        compatibilidad: compatibilidad || "",
    });

    if (!products || products.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No se encontraron productos con los filtros seleccionados.
            </div>
        );
    }

    console.log("Productos obtenidos:", products);

    return (
        <>
            <ProductosList products={products} />
            <Pagination
                currentPage={products.currentPage}
                totalPages={products.totalPages}
                limit={limit}
                pathname="/productos"
                queryParams={{
                    category,
                    priceRange,
                    sort,
                    compatibilidad,
                }}
            />
        </>
    )
}
