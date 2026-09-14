// File: frontend/components/product/skeletons/ProductSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
    return (
        <div className="mx-auto w-full min-w-0 px-2 py-1 animate-fade-in md:px-6 md:pt-2">
            {/* Migas de pan alineadas con Breadcrumbs.tsx */}
            <div className="mb-6 flex select-none items-center gap-2 px-2">
                <Skeleton className="h-3 w-10 bg-surface-tertiary" />
                <span className="text-xs text-text-tertiary/50">/</span>
                <Skeleton className="h-3 w-16 bg-surface-tertiary" />
                <span className="text-xs text-text-tertiary/50">/</span>
                <Skeleton className="h-3 w-28 bg-surface-tertiary" />
            </div>

            {/* Grid Principal idéntico a ProductDetails.tsx */}
            <article className="mx-auto flex w-full min-w-0 flex-col items-start gap-8 px-2 lg:grid lg:grid-cols-12 lg:gap-12">
                
                {/* Columna Izquierda: Galería/Carousel */}
                <div className="order-1 w-full min-w-0 overflow-hidden lg:order-none lg:col-span-7 flex flex-col md:flex-row gap-4 lg:gap-6">
                    {/* Miniaturas en Desktop (Izquierda) */}
                    <div className="hidden w-[90px] shrink-0 flex-col gap-3 md:flex lg:w-[100px]">
                        <Skeleton className="aspect-square w-full rounded-radius-md bg-surface-secondary" />
                        <Skeleton className="aspect-square w-full rounded-radius-md bg-surface-secondary" />
                        <Skeleton className="aspect-square w-full rounded-radius-md bg-surface-secondary" />
                        <Skeleton className="aspect-square w-full rounded-radius-md bg-surface-secondary" />
                    </div>

                    {/* Imagen Principal */}
                    <div className="relative aspect-square w-full flex-1">
                        <Skeleton className="h-full w-full rounded-radius-lg bg-surface-secondary" />
                    </div>
                </div>

                {/* Columna Derecha: Detalles del Producto */}
                <section className="order-2 w-full min-w-0 space-y-5 lg:sticky lg:top-24 lg:order-none lg:col-span-5">
                    <header className="space-y-3">
                        {/* Marca / SKU */}
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3 w-16 bg-surface-tertiary" />
                                <span className="text-[11px] text-border-primary">/</span>
                                <Skeleton className="h-3 w-12 bg-surface-tertiary" />
                            </div>
                            <Skeleton className="h-3 w-20 bg-surface-tertiary" />
                        </div>

                        {/* Nombre del Producto */}
                        <div className="space-y-2 pt-1">
                            <Skeleton className="h-8 w-11/12 bg-surface-secondary" />
                            <Skeleton className="h-8 w-8/12 bg-surface-secondary" />
                        </div>

                        {/* Precios */}
                        <div className="flex items-baseline gap-2.5 pt-1">
                            <Skeleton className="h-9 w-32 bg-surface-tertiary" />
                            <Skeleton className="h-5 w-24 bg-surface-tertiary" />
                        </div>
                    </header>

                    {/* Banner Automático de Promoción (Skeleton) */}
                    <Skeleton className="my-2 h-14 w-full rounded-radius-md bg-surface-secondary/40 border border-border-primary/50" />

                    {/* Atributos Destacados */}
                    <div className="grid grid-cols-2 gap-2.5 rounded-radius-lg border border-border-primary/60 bg-surface-secondary/40 p-3 sm:grid-cols-3">
                        <Skeleton className="h-10 w-full bg-surface-secondary" />
                        <Skeleton className="h-10 w-full bg-surface-secondary" />
                        <Skeleton className="h-10 w-full bg-surface-secondary" />
                    </div>

                    {/* Selector de Variantes Grid */}
                    <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16 bg-surface-tertiary" />
                            <div className="grid grid-cols-4 gap-2">
                                <Skeleton className="h-8.5 w-full rounded-radius-md bg-surface-secondary" />
                                <Skeleton className="h-8.5 w-full rounded-radius-md bg-surface-secondary" />
                                <Skeleton className="h-8.5 w-full rounded-radius-md bg-surface-secondary" />
                                <Skeleton className="h-8.5 w-full rounded-radius-md bg-surface-secondary" />
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="hidden flex-1 md:flex">
                            <Skeleton className="h-11 w-full rounded-radius-md bg-surface-tertiary" />
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-11 w-full rounded-radius-md bg-surface-tertiary" />
                        </div>
                    </div>

                    {/* Fichas de Logística de Tienda */}
                    <div className="divide-y divide-border-primary/60 rounded-radius-lg border border-border-primary/80 bg-surface-secondary/30 px-4 text-xs">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3">
                                <div className="flex w-1/3 items-center gap-2.5">
                                    <Skeleton className="size-4 shrink-0 rounded-radius-sm bg-surface-tertiary" />
                                    <Skeleton className="h-3 w-full bg-surface-tertiary" />
                                </div>
                                <Skeleton className="h-4 w-24 bg-surface-tertiary" />
                            </div>
                        ))}
                    </div>
                </section>
            </article>
        </div>
    );
}