import AddProductButton from "@/components/admin/products/AddProductButton";
import { getProducts } from "@/src/services/products";
import ProductsTable from "@/components/admin/products/ProductsTable";
import Pagination from "@/components/ui/Pagination";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
    
    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;
    const productsData = await getProducts({ page: currentPage, limit: itemsPerPage });

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between mb-6">
                <h1 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800">
                    Productos
                </h1>
                <AddProductButton />
            </div>

            {!productsData ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
                        No hay productos disponibles.
                    </h2>
                </div>
            ) : productsData.products.length === 0 ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-base sm:text-lg text-gray-500">
                        No se encontraron productos en esta página.
                    </h2>
                </div>
            ) : (
                <>
                    <ProductsTable products={productsData} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(productsData.totalProducts / itemsPerPage)}
                        limit={itemsPerPage}
                        pathname="/admin/products"
                    />
                </>
            )}
        </div>
    );
}
