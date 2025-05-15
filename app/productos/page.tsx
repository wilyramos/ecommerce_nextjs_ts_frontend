import { getProductsHomePage } from "@/src/services/products";
import ProductosList from "@/components/home/product/ProductsList";
import ProductsFilters from "@/components/home/product/ProductsFilters";
import { getCategories } from "@/src/services/categorys";


type SearchParams = {
    category?: string;
    priceRange?: string;
} 

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {


    const { category, priceRange } = await searchParams;

    const products = await getProductsHomePage({
        page: 1,
        limit: 20,
        category: category || "",
        priceRange: priceRange || ""
    });


    const categorias = await getCategories();

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
