"use client";

import { useRecentProducts } from "@/hooks/useRecentProducts";
import RecentViewed from "./RecentViewed";
import type { ProductWithCategoryResponse } from "@/src/schemas";

export default function RecentViewedClient({ producto }: { producto: ProductWithCategoryResponse }) {
    const recent = useRecentProducts(producto);
    return <RecentViewed products={recent} />;
}
