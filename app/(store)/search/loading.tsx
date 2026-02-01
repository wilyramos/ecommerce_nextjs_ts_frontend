// File: frontend/app/%28store%29/search/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import ProductGridSkeleton from "@/components/product/skeletons/product-grid-skeleton";
import FilterSidebarSkeleton from "@/components/filters/skeletons/filter-sidebar-skeleton";

export default function SearchLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* 1. Título Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-8 w-64 mb-2" /> {/* Título */}
                <Skeleton className="h-4 w-32" />      {/* Breadcrumb simulado */}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* 2. Sidebar Skeleton (Columna Izquierda) */}
                <aside className="w-full lg:w-64 shrink-0">
                    <FilterSidebarSkeleton />
                </aside>

                {/* 3. Grid Skeleton (Columna Derecha) */}
                <main className="flex-1">
                    <ProductGridSkeleton />

                    {/* Paginación Skeleton */}
                    <div className="mt-8 flex justify-center gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </main>

            </div>
        </div>
    );
}