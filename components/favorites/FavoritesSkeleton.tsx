// File: frontend/components/favorites/FavoritesSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-radius-lg border border-border-primary/60 bg-surface-primary p-3 shadow-xs">
      <Skeleton className="aspect-square w-full rounded-radius-md" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2">
          <Skeleton className="h-5 w-2/5" />
        </div>
      </div>
    </div>
  );
}

export function FavoritesGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border-primary/85 pb-4">
        <Skeleton className="h-8 w-48 md:h-9" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}