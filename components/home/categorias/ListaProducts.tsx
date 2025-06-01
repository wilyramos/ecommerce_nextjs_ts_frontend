
import { getProductsByFilter } from "@/src/services/products";
import ProductosList from "../product/ProductsList";
import Pagination from "../Pagination";


type ProductResultsProps = {
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: number;
    sort?: string;
    brand?: string;
};

export default async function ListaProducts({ category, priceRange, page, limit = 10, sort, brand }: ProductResultsProps) {

    const products = await getProductsByFilter({
        page: page ? parseInt(page) : 1,
        limit,
        category: category || "",
        priceRange: priceRange || "",
        query: "",
        brand: brand || "",
        color: "",
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
                pathname={`/categoria/${category}`}
                queryParams={{
                    priceRange,
                }}
            />
        </>
    )
}
