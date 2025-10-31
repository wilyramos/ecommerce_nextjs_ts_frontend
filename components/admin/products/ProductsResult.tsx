import { getProductsByAdmin } from '@/src/services/products';
import ProductsTable from '@/components/admin/products/ProductsTable';
import Pagination from '@/components/ui/Pagination';


type ProductsResultProps = {
    currentPage: number;
    itemsPerPage: number;
    params: {
        query?: string;
    };
};

export default async function ProductsResultsAdmin({
    currentPage,
    itemsPerPage,
    params
}: ProductsResultProps) {

    // Fetch products data using the provided parameters
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        ...params
    });

    // console.log("Products data:", productsData);

    return (
        <>
            <ProductsTable products={productsData} />
            <div className="py-2">

                <Pagination
                    currentPage={currentPage}
                    totalPages={productsData?.totalPages ?? 1}
                    limit={itemsPerPage}
                    pathname="/admin/products"
                />
            </div>
        </>
    );
}