import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductsTable from "@/components/admin/products/ProductsTable";
import Pagination from "@/components/ui/Pagination";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";
import { getProductsByAdmin } from "@/src/services/products";
import ProductsResultsAdmin from "@/components/admin/products/ProductsResult";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import { Suspense } from "react";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

    const params = await searchParams;

    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;    


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

            {/* Product Results */}
            <div className="p-4">
                <Suspense fallback={<SpinnerLoading />}>
                    <ProductsResultsAdmin
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        params={params}
                    />
                </Suspense>
            </div>
        </main>
    );
}
