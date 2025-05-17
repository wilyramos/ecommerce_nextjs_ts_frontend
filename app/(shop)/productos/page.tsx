import { getProductsHomePage } from "@/src/services/products";
import ProductosList from "@/components/home/product/ProductsList";
import ProductsFilters from "@/components/home/product/ProductsFilters";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/home/Pagination";
import { Suspense } from "react";
import { SkeletonCategory, SkeletonProduct } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Productos - Gostore",
    keywords: ["productos", "gostore", "tienda de tecnologia", "comprar productos"],
    description: "Lista de productos gostore tienda de tecnologia",
};


type Params = Promise<{
    category?: string;
    priceRange?: string;
    page?: number;
    limit?: number;
}>;


export default async function PageProducts({ params }: { params: Params }) {

    const { category = "", priceRange = "", page = 1, limit = 5 } = await params;

    const [products, categorias] = await Promise.all([
        getProductsHomePage({ category, priceRange, page, limit }),
        getCategories(),
    ]);

    if (!products || products.products.length === 0) {
        return (
            <main className="flex justify-center items-center h-screen bg-gray-50">
                <h1 className="text-2xl font-semibold text-gray-700">
                    No se encontraron productos.
                </h1>
            </main>
        );
    }

    // Paginación
    const totalPages = Math.ceil(+products.totalProducts / limit);

    return (
        <main className="p-10">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <aside className="sm:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Filtros</h2>
                    <Suspense fallback={<SkeletonCategory />}>
                        <ProductsFilters categorias={categorias} />
                    </Suspense>
                </aside>

                <section className="sm:col-span-3">
                    <h1 className="text-xl font-bold mb-6">Nuestros Productos</h1>
                    <Suspense fallback={<SkeletonProduct />}>
                        <ProductosList products={products} />
                    </Suspense>
                    <Pagination
                        currentPage={products.currentPage}
                        totalPages={totalPages}
                        limit={limit}
                        category={category}
                        priceRange={priceRange}
                    />
                </section>
            </section>
        </main>
    );
}
