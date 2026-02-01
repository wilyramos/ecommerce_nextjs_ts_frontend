import { Skeleton } from "@/components/ui/skeleton";
// import { Separator } from "@/components/ui/separator";

export default function FilterSidebarSkeleton() {
    return (
        <div className="w-full space-y-6">
            {/* Header Filtros */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12" />
            </div>

            {/* <Separator /> */}

            {/* Simulamos 4 acordeones cerrados/abiertos */}
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                    {/* Título del acordeón */}
                    <Skeleton className="h-5 w-32" />

                    {/* Contenido (Checkboxes) - Simulamos que el primero está abierto */}
                    {i <= 2 && (
                        <div className="space-y-2 pl-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    )}
                    {/* <Separator className="mt-2" /> */}
                </div>
            ))}
        </div>
    );
}