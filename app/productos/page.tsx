import { getProductsByFilter } from "@/src/services/products";
import ProductosList from "@/components/home/product/ProductsList";
import ProductsFilters from "@/components/home/product/ProductsFilters";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/home/Pagination";
import type { Metadata } from "next";

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

    // Obtener productos
    const products = await getProductsByFilter({
        page: page ? parseInt(page) : 1,
        limit: limitNumber,
        category: category || "",
        priceRange: priceRange || "",
    });

    // Obtener categorías
    const categorias = await getCategories();

    return (
        <main className="p-10">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <aside className="sm:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Filtros</h2>
                    <ProductsFilters categorias={categorias} />
                </aside>

                <section className="sm:col-span-3">
                    <h1 className="text-xl font-bold mb-6">Nuestros Productos</h1>

                    {products && products.products.length > 0 ? (
                        <>
                            <ProductosList products={products} />
                            <Pagination
                                currentPage={products.currentPage}
                                totalPages={products.totalPages}
                                limit={limitNumber}
                                category={category}
                                priceRange={priceRange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No se encontraron productos con los filtros seleccionados.
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
