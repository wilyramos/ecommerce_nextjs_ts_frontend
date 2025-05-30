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
    brand?: string;
    color?: string;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {
    const { category, priceRange, page, limit, brand, color } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 12;

    return (
        <main className="max-w-7xl mx-auto p-5">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">

                {/* Filtros */}
                <div className="sm:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Filtrar por</h2>
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando filtros...</div>}>
                        <CategoriasFiltros />
                    </Suspense>
                </div>

                {/* Productos */}
                <section className="sm:col-span-3">

                    <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2 text-end">Productos</h2>

                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
                        <ProductResults
                            category={category}
                            priceRange={priceRange}
                            page={page}
                            limit={limitNumber}
                            brand={brand}
                            color={color}
                        />
                    </Suspense>
                </section>

            </section>
        </main>

    );
}