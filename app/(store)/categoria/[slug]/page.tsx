import { Suspense } from "react";
import type { Metadata } from "next";
import FiltrosPorCategoria from "@/components/home/categorias/FiltrosPorCategoria ";
import ListaProducts from "@/components/home/categorias/ListaProducts";
import OrdenarPor from "@/components/home/products/OrdenarPor";


type Params = Promise<{
    slug: string;
}>;

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    priceRange?: string;
    sort?: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {

    const { slug } = await params;
    const categoryName = decodeURIComponent(slug).replace(/-/g, " ");

    return {
        title: `Productos en ${categoryName} - GoPhone`,
        description: `Explora nuestra amplia gama de productos en la categoría ${categoryName}. Encuentra lo mejor en tecnología y accesorios.`,
        keywords: [`productos`, `gophone`, categoryName, `comprar ${categoryName}`],
    };
}


export default async function pageCategoria({ params, searchParams }: { params: Params, searchParams: SearchParams }) {

    const { slug } = await params;
    const { priceRange, page, limit, sort } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 10;



    return (
        <main className="max-w-7xl mx-auto p-5">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">

                {/* Filtros */}
                <div className="sm:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">FiltrOS</h2>
                    <FiltrosPorCategoria categorySlug={slug} />
                </div>

                {/* Productos de la categoría */}
                <section className="sm:col-span-3 space-y-4">
                    {/* Ordenamiento arriba a la derecha */}
                    <div className="flex justify-end">
                        <OrdenarPor pathname={`/categoria/${slug}`} />
                    </div>

                    {/* Productos */}
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
                        <ListaProducts
                            category={slug}
                            priceRange={priceRange}
                            page={page}
                            limit={limitNumber}
                            sort={sort}
                        />
                    </Suspense>
                </section>
            </section>
        </main>
    )
}
