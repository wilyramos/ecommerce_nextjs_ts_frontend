// File: frontend/src/components/skeletons/product/ProductCardSkeleton.tsx

import { SkeletonBox } from '../primitives/SkeletonBox';
import { SkeletonLine } from '../primitives/SkeletonLine';
import { SkeletonGroup } from '../primitives/SkeletonGroup';

export default function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <SkeletonBox aspect="image" width="w-full" />
            <SkeletonGroup className="px-2">
                <SkeletonLine width="full" height="base" />
                <SkeletonLine width="3/4" height="sm" />
                <div className="flex gap-2 pt-2">
                    <SkeletonLine width="1/3" height="lg" />
                    <SkeletonLine width="1/3" height="lg" />
                </div>
            </SkeletonGroup>
        </div>
    );
}
