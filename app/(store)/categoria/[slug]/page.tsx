import { Suspense } from "react";
import type { Metadata } from "next";
import FiltrosPorCategoria from "@/components/home/categorias/FiltrosPorCategoria ";
import ProductResults from "@/components/home/product/ProductResults";


type Params = Promise<{
    slug: string;
}>;

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    priceRange?: string;
}>;



export default async function pageCategoria({ params, searchParams }: { params: Params, searchParams: SearchParams }) {

    const { slug } = await params;
    const { priceRange, page, limit } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 12;


    return (
        <main className="max-w-7xl mx-auto p-5">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">

                {/* Filtros */}
                <div className="sm:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Filtrar por</h2>
                    <FiltrosPorCategoria categorySlug={slug} />
                </div>

                {/* Productos de la categoría */}
                <section className="sm:col-span-3">


                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
                        <ProductResults
                            category={slug}
                            priceRange={priceRange}
                            page={page}
                            limit={limitNumber}
                        />
                    </Suspense>


                </section>

            </section>
        </main>
    )
}
