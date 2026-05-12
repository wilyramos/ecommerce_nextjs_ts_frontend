// File: frontend/src/components/skeletons/primitives/SkeletonBox.tsx

interface SkeletonBoxProps {
    width?: string;
    height?: string;
    aspect?: 'square' | 'video' | 'image';
    className?: string;
}

const aspectMap = {
    square: 'aspect-square',
    video: 'aspect-video',
    image: 'aspect-[3/4]',
};

export function SkeletonBox({
    width = 'w-full',
    height = '',
    aspect = 'square',
    className = '',
}: SkeletonBoxProps) {
    return (
        <div
            className={`${width} ${height} ${aspectMap[aspect]} bg-gray-200 rounded-lg animate-pulse ${className}`}
        />
    );
}