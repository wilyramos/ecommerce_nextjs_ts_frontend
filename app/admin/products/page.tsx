import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductsTable from "@/components/admin/products/ProductsTable";
import Pagination from "@/components/ui/Pagination";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";
import { getProductsByFilter } from "@/src/services/products";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

    const params = await searchParams;

    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;

    const productsData = await getProductsByFilter({
        page: currentPage,
        limit: itemsPerPage,
        category: "",
        priceRange: "",
        query: params.query || "",
    });

    return (
        <main className="">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                    <ProductSearchInput />
                    <AddProductButton />
                </div>
            </div>

            {/* Content Box */}
                {productsData?.products?.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No se encontraron productos.</p>
                    </div>
                ) : !productsData ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm">Cargando productos...</p>
                    </div>
                ) : (
                    <>
                        <ProductsTable products={productsData} />

                        <div className="pt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(productsData.totalProducts / itemsPerPage)}
                                limit={itemsPerPage}
                                pathname="/admin/products"
                            />
                        </div>
                    </>
                )}
        </main>
    );
}
