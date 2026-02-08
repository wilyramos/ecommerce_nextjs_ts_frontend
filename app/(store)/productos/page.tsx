// File: frontend/app/(store)/productos/page.tsx

import { Suspense } from "react";

import ProductResults from "@/components/home/product/ProductResults";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

type SearchParams = Promise<{
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: string;
    sort?: string;
    query?: string;
    [key: string]: string | string[] | undefined;
}>;

export default async function PageProducts({
    searchParams
}: {
    searchParams: SearchParams;
}) {
    const { category, priceRange, page, limit, sort, query, ...rest } =
        await searchParams;

    const limitNumber = limit ? parseInt(limit) : 24;

    return (
        <main className="md:max-w-screen-2xl mx-auto p-2 md:px-4">
            <Suspense fallback={<SpinnerLoading />}>
                <ProductResults
                    category={category}
                    priceRange={priceRange}
                    page={page}
                    limit={limitNumber}
                    sort={sort}
                    query={query}
                    {...rest}
                />
            </Suspense>
        </main>
    );
}
