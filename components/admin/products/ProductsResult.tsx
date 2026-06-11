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
        nombre?: string;
        sku?: string;
        sort?: string;
        brand?: string;
        isActive?: string;
        category?: string;
    };
};

export default async function ProductsResultsAdmin({
    currentPage,
    itemsPerPage,
    params
}: ProductsResultProps) {
    // 1. Desestructurar el parámetro compuesto 'sort' y el resto de filtros
    const { sort, ...restParams } = params;

    // 2. Inicializar los ordenamientos específicos esperados por el servicio
    let precioSort: "asc" | "desc" | undefined = undefined;
    let stockSort: "asc" | "desc" | undefined = undefined;

    // 3. Parsear el valor del Select ("precio-asc" | "precio-desc" | "stock-asc" | "stock-desc")
    if (sort) {
        if (sort.startsWith("precio-")) {
            precioSort = sort.replace("precio-", "") as "asc" | "desc";
        } else if (sort.startsWith("stock-")) {
            stockSort = sort.replace("stock-", "") as "asc" | "desc";
        }
    }

    // 4. Consumir los servicios de forma asíncrona pasando los parámetros formateados
    const productsData = await getProductsByAdmin({
        page: currentPage,
        limit: itemsPerPage,
        precioSort,
        stockSort,
        ...restParams
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