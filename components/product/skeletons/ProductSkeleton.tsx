// File: frontend/components/product/skeletons/ProductSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
    return (
        <div className="w-full mx-auto px-2 md:px-6 py-1 md:pt-5 animate-fade-in">
            {/* Migas de pan alineadas con Breadcrumbs.tsx */}
            <div className="flex items-center gap-2 mb-4 px-2 select-none">
                <Skeleton className="h-3 w-10 bg-muted" />
                <span className="text-muted-foreground/40 text-xs">/</span>
                <Skeleton className="h-3 w-16 bg-muted" />
                <span className="text-muted-foreground/40 text-xs">/</span>
                <Skeleton className="h-3 w-28 bg-muted" />
            </div>

            {/* Grid Principal idéntico a ProductDetails.tsx */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 text-foreground bg-background px-2">

                {/* Columna Izquierda: Galería/Carousel (Alineación con ImagenesProductoCarousel.tsx) */}
                <div className="md:col-span-7 flex flex-col md:flex-row gap-4 lg:gap-6 sticky top-24">
                    {/* Miniaturas en Desktop (Izquierda) */}
                    <div className="hidden md:flex flex-col w-[120px] shrink-0 gap-2">
                        <Skeleton className="aspect-square w-full rounded-none bg-muted" />
                        <Skeleton className="aspect-square w-full rounded-none bg-muted" />
                        <Skeleton className="aspect-square w-full rounded-none bg-muted" />
                        <Skeleton className="aspect-square w-full rounded-none bg-muted" />
                    </div>

                    {/* Imagen Principal */}
                    <div className="flex-1 relative aspect-square bg-muted rounded-none w-full">
                        <Skeleton className="w-full h-full rounded-none bg-muted" />
                    </div>
                </div>

                {/* Columna Derecha: Detalles del Producto */}
                <div className="md:col-span-5 md:px-0 space-y-4 pb-1">
                    <div className="space-y-4">
                        <header className="py-1 space-y-2">
                            {/* Marca / SKU */}
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-3 w-16 bg-muted" />
                                    <span className="text-border text-xs">/</span>
                                    <Skeleton className="h-3 w-12 bg-muted" />
                                </div>
                                <Skeleton className="h-3 w-20 bg-muted" />
                            </div>

                            {/* Nombre del Producto */}
                            <div className="space-y-2 pt-1">
                                <Skeleton className="h-7 w-11/12 bg-muted" />
                                <Skeleton className="h-7 w-8/12 bg-muted" />
                            </div>

                            {/* Atributo Color (Simulación de ColorCircle) */}
                            <div className="flex items-center gap-2 pt-1">
                                <Skeleton className="h-3 w-10 bg-muted" />
                                <div className="flex gap-1.5">
                                    <Skeleton className="h-[18px] w-[18px] rounded-full bg-muted" />
                                    <Skeleton className="h-[18px] w-[18px] rounded-full bg-muted" />
                                </div>
                            </div>

                            {/* Precios */}
                            <div className="flex items-baseline gap-3 pt-2">
                                <Skeleton className="h-9 w-32 bg-muted" />
                                <Skeleton className="h-5 w-24 bg-muted" />
                            </div>
                        </header>

                        {/* Selector de Variantes Grid (Simulación de Atributos) */}
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16 bg-muted" />
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                <Skeleton className="h-[74px] w-full rounded-none bg-muted" />
                                <Skeleton className="h-[74px] w-full rounded-none bg-muted" />
                                <Skeleton className="h-[74px] w-full rounded-none bg-muted" />
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <section className="flex justify-between items-center gap-4 pt-4">
                            <div className="hidden md:flex flex-1">
                                <Skeleton className="h-10 w-full rounded-none bg-muted" />
                            </div>
                            <div className="flex-1">
                                <Skeleton className="h-10 w-full rounded-none bg-muted animate-pulse" />
                            </div>
                        </section>
                    </div>

                    {/* Fichas de Logística de Tienda */}
                    <div className="divide-y divide-border/40 pt-2">
                        {/* Medios de pago */}
                        <div className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-2.5 w-1/3">
                                <Skeleton className="h-4 w-4 shrink-0 bg-muted" />
                                <Skeleton className="h-3 w-full bg-muted" />
                            </div>
                            <Skeleton className="h-5 w-36 bg-muted" />
                        </div>

                        {/* Garantía */}
                        <div className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-2.5 w-1/3">
                                <Skeleton className="h-4 w-4 shrink-0 bg-muted" />
                                <Skeleton className="h-3 w-full bg-muted" />
                            </div>
                            <Skeleton className="h-5 w-28 bg-muted" />
                        </div>

                        {/* Envío */}
                        <div className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-2.5 w-1/3">
                                <Skeleton className="h-4 w-4 shrink-0 bg-muted" />
                                <Skeleton className="h-3 w-full bg-muted" />
                            </div>
                            <Skeleton className="h-4 w-24 bg-muted" />
                        </div>

                        {/* Consulta por WhatsApp */}
                        <div className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-2.5 w-1/4">
                                <Skeleton className="h-4 w-4 shrink-0 bg-muted" />
                                <Skeleton className="h-3 w-full bg-muted" />
                            </div>
                            <Skeleton className="h-3 w-16 bg-muted" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}