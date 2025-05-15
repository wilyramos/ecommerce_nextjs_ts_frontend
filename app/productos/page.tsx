import { getProductsHomePage } from "@/src/services/products";
import ProductosList from "@/components/home/product/ProductsList";
import ProductsFilters from "@/components/home/product/ProductsFilters";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/home/Pagination";



type SearchParams = Promise<{
    category?: string;
    priceRange?: string;
    page?: number;
    limit?: number;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {


    const { category, priceRange, page, limit } = await searchParams;
    const limitValue = limit || 5;


    const products = await getProductsHomePage({
        page: page || 1,
        limit: limitValue,
        category: category || "",
        priceRange: priceRange || ""
    });


    const categorias = await getCategories();

    if (!products) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700">No hay productos</h1>
            </div>
        );
    }

    // Pagination

    const totalPages = Math.ceil(+products.totalProducts / limitValue);

    return (
        <main className="p-10">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <aside className="sm:col-span-1">
                    <ProductsFilters categorias={categorias} />
                </aside>

                {/* Lista de productos */}

                {products && products.products.length > 0 ? (
                    <section className="sm:col-span-3">
                        <h1 className="text-2xl font-semibold mb-6">Nuestros Productos</h1>
                        <ProductosList products={products} />
                        {/* Paginación */}
                        <Pagination
                            currentPage={products.currentPage}
                            totalPages={totalPages}
                            limit={limitValue}
                            category={category}
                            priceRange={priceRange}
                        />
                    </section>

                ) : (
                    <section className="sm:col-span-3">
                        <p className="text-lg font-semibold text-gray-600">
                            No se encontraron productos para esta búsqueda.
                        </p>
                    </section>
                )}
            </section>
        </main>
    );
}
