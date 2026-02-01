import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 bg-[var(--store-bg)] min-h-screen">
            <Skeleton className="h-4 w-32 mb-10" />
            <Skeleton className="h-10 w-64 mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center p-6 bg-[var(--store-surface)] rounded-2xl space-y-4">
                        <Skeleton className="w-24 h-24 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}