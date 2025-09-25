import { Suspense } from "react";

// UI
import SpinnerLoading from "@/components/ui/SpinnerLoading";

// Admin
import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";
import ProductsResultsAdmin from "@/components/admin/products/ProductsResult";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const itemsPerPage = Number(params.limit) || 10;

    return (
        <AdminPageWrapper
            title="Productos"
            showBackButton={false}
            actions={
                <div className="flex items-center gap-3">
                    <ProductSearchInput />
                    <AddProductButton />
                </div>
            }
        >
            <Suspense fallback={<SpinnerLoading />}>
                <ProductsResultsAdmin
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    params={params}
                />
            </Suspense>
        </AdminPageWrapper>
    );
}
