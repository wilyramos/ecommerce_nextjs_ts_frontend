// File: frontend/components/skeletons/primitives/SkeletonLine.tsx

interface SkeletonLineProps {
    width?: 'full' | 'half' | '3/4' | '1/3' | '1/4' | '1/2';
    height?: 'sm' | 'base' | 'lg';
    className?: string;
}

const widthMap = {
    full: 'w-full',
    half: 'w-1/2',
    '3/4': 'w-3/4',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
    '1/2': 'w-1/2',
};

const heightMap = {
    sm: 'h-3',
    base: 'h-4',
    lg: 'h-6',
};

export function SkeletonLine({
    width = 'full',
    height = 'base',
    className = '',
}: SkeletonLineProps) {
    return (
        <div
            className={`${widthMap[width]} ${heightMap[height]} bg-gray-200 rounded animate-pulse ${className}`}
        />
    );
}