import type { Metadata } from "next";
import { Suspense } from "react";
import ProductResults from "@/components/home/product/ProductResults";
import CategoriasFiltros from "@/components/home/product/CategoriasFiltros";

export const metadata: Metadata = {
    title: "Productos - Gostore",
    keywords: ["productos", "gostore", "tienda de tecnologia", "comprar productos"],
    description: "Lista de productos gostore tienda de tecnologia",
};

type SearchParams = Promise<{
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: string;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {
    const { category, priceRange, page, limit } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 10;

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">

                <aside className="sm:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando filtros...</div>}>
                        <CategoriasFiltros />
                    </Suspense>
                </aside>

                <section className="sm:col-span-3">
                    <h1 className="text-lg font-semibold text-gray-800 mb-6">Nuestros Productos</h1>
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
                        <ProductResults
                            category={category}
                            priceRange={priceRange}
                            page={page}
                            limit={limitNumber}
                        />
                    </Suspense>
                </section>

            </section>
        </main>

    );
}