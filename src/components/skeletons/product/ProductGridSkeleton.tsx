// File: frontend/src/components/skeletons/product/ProductGridSkeleton.tsx

import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
    count?: number;
    columns?: 'sm' | 'md' | 'lg';
}

const columnsMap = {
    sm: 'grid-cols-1',
    md: 'grid-cols-2 md:grid-cols-3',
    lg: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function ProductGridSkeleton({
    count = 12,
    columns = 'lg',
}: ProductGridSkeletonProps) {
    return (
        <div className={`grid ${columnsMap[columns]} gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}