import { getProductsByAdmin } from "@/src/services/products";
import ProductsTablePOS from "@/components/POS/products/ProductsTablePOS";
import Pagination from "@/components/home/Pagination";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function pageProductosPOS({ searchParams }: { searchParams: SearchParams }) {



    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;

    // Fetch products data using the provided parameters
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        query: params.query,
    });

    if (!productsData || productsData.products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No se encontraron productos.</p>
            </div>
        );
    }

    return (

        <>
            <ProductSearchInput />

            <ProductsTablePOS products={productsData} />

            <div className="pt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(productsData.totalProducts / itemsPerPage)}
                    limit={itemsPerPage}
                    pathname="/pos/productos"
                />
            </div>
        </>
    )
}