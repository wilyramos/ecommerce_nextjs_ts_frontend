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

    return (
        <>
            <ProductSearchInput />
            <ProductsTablePOS products={productsData} />
            <div className="pt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={productsData?.totalPages ?? 1}
                    limit={itemsPerPage}
                    pathname={`/pos/productos?page=${currentPage}&limit=${itemsPerPage}`}
                />
            </div>
        </>
    )
}