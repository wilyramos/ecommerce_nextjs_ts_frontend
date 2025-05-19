// import ProductsFilters from "@/components/home/product/ProductsFilters";
// import { getCategories } from "@/src/services/categorys";
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
    const limitNumber = limit ? parseInt(limit) : 5;

    // Obtener categorías
    // const categories = await getCategories();

    return (
        <main className="p-10">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <aside className="sm:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Filtros</h2>
                    <Suspense fallback={<div className="text-center py-10 text-gray-500">Cargando filtros...</div>}>
                       <CategoriasFiltros />
                    </Suspense>
                </aside>

                <section className="sm:col-span-3">
                    <h1 className="text-xl font-bold mb-6">Nuestros Productos</h1>

                    <Suspense fallback={<div className="text-center py-10 text-gray-500">Cargando productos...</div>}>
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