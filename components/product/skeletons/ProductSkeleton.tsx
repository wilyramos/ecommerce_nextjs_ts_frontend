// File: frontend/components/home/product/ProductSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
    return (
        <div className="container mx-auto px-2 md:px-6 pt-1 md:pt-5">
            {/* Migas de pan */}
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-16" />
                <span className="text-border text-xs">/</span>
                <Skeleton className="h-4 w-24" />
                <span className="text-border text-xs">/</span>
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">

                {/* Columna Izquierda: Galería/Carousel */}
                <div className="md:col-span-7 space-y-2">
                    {/* Imagen principal */}
                    <Skeleton className="w-full aspect-square md:aspect-video lg:aspect-square rounded-none" />
                    {/* Miniaturas */}
                    <div className="flex gap-2">
                        <Skeleton className="w-20 h-20 rounded-none" />
                        <Skeleton className="w-20 h-20 rounded-none" />
                        <Skeleton className="w-20 h-20 rounded-none" />
                    </div>
                </div>

                {/* Columna Derecha: Detalles del Producto */}
                <div className="md:col-span-5 px-2 md:px-0 space-y-6">
                    <div className="space-y-3">
                        {/* Marca / SKU */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>

                        {/* Título Principal */}
                        <Skeleton className="h-8 w-11/12" />
                        <Skeleton className="h-8 w-8/12" />
                    </div>

                    {/* Precios */}
                    <div className="flex items-baseline gap-3 pt-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-5 w-20" />
                    </div>

                    {/* Selector de Variantes (Simulación de Atributos) */}
                    <div className="space-y-2.5 pt-2">
                        <Skeleton className="h-3 w-32" />
                        <div className="grid grid-cols-5 gap-2">
                            <Skeleton className="h-16 w-full rounded-none" />
                            <Skeleton className="h-16 w-full rounded-none" />
                            <Skeleton className="h-16 w-full rounded-none" />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <Skeleton className="h-11 flex-1 hidden md:block rounded-none" />
                        <Skeleton className="h-11 flex-1 rounded-none" />
                    </div>

                    {/* Fichas de Logística */}
                    <div className="divide-y divide-border/40 pt-4">
                        <div className="flex justify-between py-3">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="flex justify-between py-3">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <div className="flex justify-between py-3">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}