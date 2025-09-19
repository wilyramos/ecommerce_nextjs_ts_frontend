import { Suspense } from "react";

// UI
import { HeadingH1 } from "@/components/ui/Heading";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

// Admin
import AddProductButton from "@/components/admin/products/AddProductButton";
import ProductSearchInput from "@/components/admin/products/ProductSearchInput";
import ProductsResultsAdmin from "@/components/admin/products/ProductsResult";

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
        <main>
            {/* Encabezado */}
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between 
            mb-4">
                <HeadingH1>Productos</HeadingH1>
                <div className="flex items-center gap-3">
                    <ProductSearchInput />
                    <AddProductButton />
                </div>
            </header>

            {/* Resultados */}
            <section className="">
                <Suspense fallback={<SpinnerLoading />}>
                    <ProductsResultsAdmin
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        params={params}
                    />
                </Suspense>
            </section>
        </main>
    );
}
