// File: frontend/src/components/skeletons/primitives/SkeletonGroup.tsx

interface SkeletonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SkeletonGroup({ children, className = '' }: SkeletonGroupProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}