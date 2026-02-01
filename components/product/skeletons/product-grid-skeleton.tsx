import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Generamos 8 tarjetas vacías */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    {/* Imagen cuadrada */}
                    <Skeleton className="aspect-square w-full rounded-xl" />

                    <div className="space-y-2 p-2">
                        {/* Título (2 líneas) */}
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />

                        {/* Precio y Stock */}
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-6 w-20" /> {/* Precio */}
                            <Skeleton className="h-5 w-12" /> {/* Badge Stock */}
                        </div>
                    </div>
                </div>
            ))} 
        </div>
    );
}