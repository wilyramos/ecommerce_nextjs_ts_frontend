import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";
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
        <main className="text-slate-600">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 py-2 border-b-2">
                <div className="flex justify-between items-center w-full">
                    <ProductSearchInput />
                    <AddProductButton />
                </div>
            </div>

            {/* Product Results */}
            <Suspense fallback={<SpinnerLoading />}>
                <ProductsResultsAdmin
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    params={params}
                />
            </Suspense>
        </main>
    );
}
