import { getProductsByAdmin } from '@/src/services/products';
import ProductsTable from '@/components/admin/products/ProductsTable';
import Pagination from '@/components/ui/Pagination';
import PageSizeSelector from '@/components/ui/PageSizeSelector';
import { getAllSubcategories } from '@/src/services/categorys';
import { getBrands } from '@/src/services/brands';

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
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        ...params
    });

    const categories = await getAllSubcategories();
    const brands = await getBrands();

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden">
                <ProductsTable
                    products={productsData}
                    categories={categories}
                    brands={brands}
                />
            </div>
            
            <div className="py-2 px-4 shrink-0 flex items-center justify-between border-t border-border/40 bg-muted/5">
                <PageSizeSelector currentLimit={itemsPerPage} />
                
                <Pagination
                    currentPage={currentPage}
                    totalPages={productsData?.totalPages ?? 1}
                    limit={itemsPerPage}
                    pathname="/admin/products"
                />
            </div>
        </div>
    );
}