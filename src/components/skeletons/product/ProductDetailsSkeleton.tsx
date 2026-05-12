// File: frontend/src/components/skeletons/product/ProductDetailsSkeleton.tsx

import { SkeletonBox } from '../primitives/SkeletonBox';
import { SkeletonLine } from '../primitives/SkeletonLine';
import { SkeletonGroup } from '../primitives/SkeletonGroup';

export function ProductDetailsSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Galería */}
            <div className="w-full lg:w-1/2">
                <SkeletonBox aspect="image" width="w-full" className="mb-4" />
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonBox
                            key={i}
                            width="w-20"
                            height="h-20"
                            aspect="square"
                        />
                    ))}
                </div>
            </div>

            {/* Detalles */}
            <div className="w-full lg:w-1/2">
                <SkeletonGroup className="mb-8">
                    <SkeletonLine width="3/4" height="lg" />
                    <SkeletonLine width="1/2" height="sm" />
                    <SkeletonLine width="1/3" height="base" />
                </SkeletonGroup>

                {/* Precio */}
                <SkeletonGroup className="mb-8">
                    <SkeletonLine width="1/4" height="lg" />
                    <SkeletonLine width="1/3" height="base" />
                </SkeletonGroup>

                {/* Botones */}
                <div className="flex gap-3 mb-8">
                    <SkeletonLine width="1/2" height="lg" />
                    <SkeletonLine width="1/2" height="lg" />
                </div>

                {/* Características */}
                <SkeletonGroup>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonLine key={i} width="full" height="base" />
                    ))}
                </SkeletonGroup>
            </div>
        </div>
    );
}