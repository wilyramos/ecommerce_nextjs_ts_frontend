// File: frontend/components/favorites/FavoritesSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-radius-lg border border-border-primary/60 bg-surface-primary p-3 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-radius-md bg-surface-secondary" />
      <div className="mt-3.5 space-y-2">
        <Skeleton className="h-3 w-1/4 bg-surface-secondary" />
        <Skeleton className="h-4 w-4/5 bg-surface-secondary" />
        <div className="pt-2">
          <Skeleton className="h-5 w-1/3 bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

export function FavoritesGridSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col gap-2 border-b border-border-primary/60 pb-6">
        <Skeleton className="h-8 w-48 rounded-radius-sm bg-surface-secondary md:h-10" />
        <Skeleton className="h-4 w-72 rounded-radius-sm bg-surface-secondary" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}